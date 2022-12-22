import { ReactNode } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import produce from 'immer'
import { v4 as uuid } from 'uuid'

import { Heading } from '@siakit/heading'
import { Flex } from '@siakit/layout'
import { Text } from '@siakit/text'

import { Element, useStore } from './store'

const COMPONENT_TYPE = 'component'

const items = [
  {
    id: 'flex',
    content: 'flex',
  },
  {
    id: 'heading',
    content: 'heading',
  },
  {
    id: 'text',
    content: 'text',
  },
]

type Item = {
  id: string
  content: string
}

type ComponentProps = {
  item: Item
}

function Component({ item }: ComponentProps) {
  const [{ isDragging }, dragRef] = useDrag({
    type: COMPONENT_TYPE,
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <Flex
      ref={dragRef}
      padding
      css={{
        backgroundColor: '$blue4',
        border: '1px solid $blue9',
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      {item.content}
    </Flex>
  )
}

type DropZoneProps = {
  referenceId: string
  onDrop: (data: any) => void
}

function DropZone({ referenceId, onDrop }: DropZoneProps) {
  const [{ isOver }, drop] = useDrop({
    accept: [COMPONENT_TYPE],
    drop: (item, monitor) => {
      onDrop({ item, referenceId })
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  return (
    <Flex
      ref={drop}
      padding
      css={
        isOver
          ? { border: '2px solid $violet6', backgroundColor: '$violet4' }
          : { border: '2px dashed $gray8' }
      }
    >
      drop component here..
    </Flex>
  )
}

type FlexComponentProps = {
  item: Element
  children: ReactNode
  onDrop: (data: any) => void
}

function FlexComponent({ item, children, onDrop }: FlexComponentProps) {
  const [{ isDragging }, dragRef] = useDrag({
    type: COMPONENT_TYPE,
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !!item?.parentId,
  })

  return (
    <Flex
      ref={dragRef}
      padding
      css={{
        backgroundColor: '$gray4',
        border: '1px solid $gray9',
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      {children}
      <DropZone referenceId={item.id} onDrop={onDrop} />
    </Flex>
  )
}

type TextComponentProps = {
  item: any
}

function TextComponent({ item }: TextComponentProps) {
  const [{ isDragging }, dragRef] = useDrag({
    type: COMPONENT_TYPE,
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <Flex
      ref={dragRef}
      css={{
        backgroundColor: '$green4',
        border: '1px solid $green9',
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <Text>{item.text}</Text>
    </Flex>
  )
}

type RenderComponentProps = {
  id: string
  onDrop: (data: any) => void
}

function RenderComponent({ id, onDrop }: RenderComponentProps) {
  const elements = useStore((state) => state.elements)

  const element = elements[id]

  if (element.type === 'flex') {
    return (
      <FlexComponent item={element} onDrop={onDrop}>
        {element.children?.map((item: any) => (
          <RenderComponent key={item} id={item} onDrop={onDrop} />
        ))}
      </FlexComponent>
    )
  }

  if (element.type === 'text') {
    return <TextComponent item={element} />
  }

  return <Text>not defined</Text>
}

type TrashDropZoneProps = {
  onRemove: (data: { item: any }) => void
}

function TrashDropZone({ onRemove }: TrashDropZoneProps) {
  const [{ isOver }, drop] = useDrop({
    accept: [COMPONENT_TYPE],
    drop: (item) => {
      onRemove({ item })
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  return (
    <Flex
      ref={drop}
      padding
      css={
        isOver
          ? {
              backgroundColor: '$red9',
              border: '1px solid $red9',
              color: '$white',
            }
          : { backgroundColor: '$red4', border: '1px solid $red9' }
      }
    >
      trash
    </Flex>
  )
}

export function Test() {
  const { elements, setElements } = useStore((state) => ({
    elements: state.elements,
    setElements: state.setElements,
  }))

  function onDrop(data: any) {
    if (data.item?.content) {
      if (data.item.content === 'text') {
        const newItem = {
          id: uuid(),
          type: 'text',
          text: 'text test',
          parentId: data.referenceId,
        }

        setElements(
          produce(elements, (draft) => {
            draft[data.referenceId].children?.push(newItem.id)
            draft[newItem.id] = newItem
          }),
        )
      }

      if (data.item.content === 'flex') {
        const newItem = {
          id: uuid(),
          type: 'flex',
          children: [],
          parentId: data.referenceId,
        }

        setElements(
          produce(elements, (draft) => {
            draft[data.referenceId].children?.push(newItem.id)
            draft[newItem.id] = newItem
          }),
        )
      }
    }
  }

  function handleRemove({ item }: any) {
    if (item.children?.length) {
      alert('children needs to be empty')
    } else {
      setElements(
        produce(elements, (draft) => {
          draft[item.parentId].children = draft[item.parentId].children?.filter(
            (element) => element !== item.id,
          )

          delete draft[item.id]
        }),
      )
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Flex flex>
        <Flex flex direction="column">
          <RenderComponent id="default" onDrop={onDrop} />
        </Flex>

        <Flex
          direction="column"
          width={320}
          gap
          padding
          css={{ backgroundColor: '$gray3' }}
        >
          <Flex>
            <Heading>components</Heading>
          </Flex>

          <Flex flex direction="column" gap={8}>
            {items.map((item) => (
              <Component key={item.id} item={item} />
            ))}
          </Flex>

          <TrashDropZone onRemove={handleRemove} />
        </Flex>
      </Flex>
    </DndProvider>
  )
}
