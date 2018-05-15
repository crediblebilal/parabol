// @flow
import type {ReflectionCardInFlight_reflection as Reflection} from './__generated__/ReflectionCardInFlight_reflection.graphql'
import * as React from 'react'
import ReflectionEditorWrapper from 'universal/components/ReflectionEditorWrapper'
import {ReflectionCardRoot} from 'universal/components/ReflectionCard/ReflectionCard'
// $FlowFixMe
import {convertFromRaw, EditorState} from 'draft-js'
import styled from 'react-emotion'
import ui from 'universal/styles/ui'
import withAtmosphere from 'universal/decorators/withAtmosphere/withAtmosphere'
import {commitLocalUpdate, createFragmentContainer} from 'react-relay'
import UpdateDragLocationMutation from 'universal/mutations/UpdateDragLocationMutation'


type Coords = {
  x: number,
  y: number
}

type Props = {|
  atmosphere: Object,
  initialComponentOffset: Coords,
  initialCursorOffset: Coords,
  reflection: Reflection
|}

const ModalBlock = styled('div')({
  top: 0,
  left: 0,
  padding: '.25rem .5rem',
  pointerEvents: 'none',
  position: 'absolute',
  zIndex: ui.ziTooltip
})

class ReflectionCardInFlight extends React.Component<Props> {
  constructor (props) {
    super(props)
    this.initialComponentOffset = props.initialComponentOffset
    this.initialCursorOffset = props.initialCursorOffset
    this.editorState = EditorState.createWithContent(
      convertFromRaw(JSON.parse(this.props.reflection.content))
    )
  }

  componentDidMount () {
    window.addEventListener('drag', this.setDragState)
  }

  componentWillUnmount () {
    window.removeEventListener('drag', this.setDragState)
  }

  setDragState = (e) => {
    const {
      atmosphere,
      reflection: {reflectionId, dragCoords}
    } = this.props
    const xDiff = e.x - this.initialCursorOffset.x
    const yDiff = e.y - this.initialCursorOffset.y
    const x = this.initialComponentOffset.x + xDiff
    const y = this.initialComponentOffset.y + yDiff
    if (x !== dragCoords.x || y !== dragCoords.y) {
      const input = {
        coords: {x, y},
        sourceId: reflectionId
      }
      UpdateDragLocationMutation(atmosphere, {input})
    }
  }

  editorState: Object
  initialComponentOffset: Coords
  initialCursorOffset: Coords

  render () {
    const {
      reflection: {dragCoords}
    } = this.props
    if (!dragCoords) return null
    const {x, y} = dragCoords
    const transform = `translate3d(${x}px, ${y}px, 0px)`
    return (
      <ModalBlock style={{transform}}>
        <ReflectionCardRoot>
          <ReflectionEditorWrapper editorState={this.editorState} readOnly />
        </ReflectionCardRoot>
      </ModalBlock>
    )
  }
}

export default createFragmentContainer(
  withAtmosphere(ReflectionCardInFlight),
  graphql`
    fragment ReflectionCardInFlight_reflection on RetroReflection {
      reflectionId: id
      content
      dragCoords {
        x
        y
      }
    }
  `
)
