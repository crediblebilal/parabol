/**
 * Publishes the drag location to the team
 *
 * @flow
 */
import type {Context} from 'server/flowtypes/graphql'
import {GraphQLNonNull} from 'graphql'
import DragReflectionPayload from 'server/graphql/types/DragReflectionPayload'
import UpdateDragLocationPayload from 'server/graphql/types/UpdateDragLocationPayload'
import UpdateLocationDragInput from 'server/graphql/types/UpdateLocationDragInput'
import publish from 'server/utils/publish'
import {TEAM} from 'universal/utils/constants'

type Args = {
  isDragging: boolean,
  reflectionId: string
}

export default {
  description:
    'all the info required to provide an accurate display-specific location of where an item is',
  type: UpdateDragLocationPayload,
  args: {
    input: {
      type: new GraphQLNonNull(UpdateLocationDragInput)
    }
  },
  async resolve (
    source: Object,
    input: Args,
    {authToken, dataLoader, socketId: mutatorId}: Context
  ) {
    const operationId = dataLoader.share()
    const subOptions = {operationId, mutatorId}
    const {teamId, ...data} = input
    publish(TEAM, teamId, DragReflectionPayload, data, subOptions)
    return data
  }
}
