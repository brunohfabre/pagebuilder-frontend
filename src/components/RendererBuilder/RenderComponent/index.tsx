import { Text } from '@siakit/text'

import { NodeType } from '../../../pages/Routes/Route'
import { ButtonComponent } from './components/ButtonComponent'
import { FlexComponent } from './components/FlexComponent'
import { FormComponent } from './components/FormComponent'
import { HeadingComponent } from './components/HeadingComponent'
import { OutletComponent } from './components/OutletComponent'
import { TableComponent } from './components/TableComponent'
import { TextComponent } from './components/TextComponent'
import { TextInputComponent } from './components/TextInputComponent'

type RenderComponentProps = {
  nodeId: string
  onDelete: (node: NodeType) => void
  items: { [key: string]: NodeType }
}

export function RenderComponent({
  nodeId,
  onDelete,
  items,
}: RenderComponentProps) {
  const node = items[nodeId]

  if (node.type === 'flex') {
    return <FlexComponent node={node} onDelete={onDelete} items={items} />
  }

  if (node.type === 'text') {
    return <TextComponent node={node} onDelete={onDelete} />
  }

  if (node.type === 'heading') {
    return <HeadingComponent node={node} onDelete={onDelete} />
  }

  if (node.type === 'button') {
    return <ButtonComponent node={node} onDelete={onDelete} />
  }

  if (node.type === 'table') {
    return <TableComponent node={node} onDelete={onDelete} />
  }

  if (node.type === 'form') {
    return <FormComponent node={node} onDelete={onDelete} items={items} />
  }

  if (node.type === 'text-input') {
    return <TextInputComponent node={node} onDelete={onDelete} />
  }

  if (node.type === 'outlet') {
    return <OutletComponent node={node} onDelete={onDelete} />
  }

  return <Text>component not defined</Text>
}
