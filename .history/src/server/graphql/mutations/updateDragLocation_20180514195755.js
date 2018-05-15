import {GraphQLNonNull} from 'graphql'
import DragReflectionPayload from 'server/graphql/types/DragReflectionPayload'
import UpdateDragLocationPayload from 'server/graphql/types/UpdateDragLocationPayload'
import UpdateDragLocationInput from 'server/graphql/types/UpdateLocationDragInput'
import publish from 'server/utils/publish'
import {TEAM} from 'universal/utils/constants'

const updateDragLocation = {
  description:
    'all the info required to provide an accurate display-specific location of where an item is',
  type: UpdateDragLocationPayload,
  args: {
    input: {
      type: new GraphQLNonNull(UpdateDragLocationInput)
    }
  },
  async resolve (source, input, {authToken, dataLoader, socketId: mutatorId}) {
    const operationId = dataLoader.share()
    const subOptions = {operationId, mutatorId}
    const {teamId, ...data} = input
    if (!authToken || !authToken.tms.includes(teamId)) return
    publish(TEAM, teamId, DragReflectionPayload, data, subOptions)
    return data
  }
}

export default updateDragLocation
