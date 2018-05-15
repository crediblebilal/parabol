import {GraphQLFloat, GraphQLObjectType, GraphQLNonNull, GraphQLID} from 'graphql'
import Coords2D from 'server/graphql/types/Coords2D'
import DraggableTypeEnum from 'server/graphql/types/DraggableTypeEnum'

const DraggerCoords = new GraphQLObjectType({
  name: 'DraggerCoords',
  description: 'Coordinates used to share a drag',
  fields: () => ({
    clientWidth: {
      type: new GraphQLNonNull(GraphQLFloat)
    },
    coords: {
      type: new GraphQLNonNull(Coords2D)
    },
    distance: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'A float from 0 to 1 representing the % of the distance traveled from the origin to the target'
    },
    targetId: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The assumed destination of the item being drug'
    },
    targetId: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'The assumed destination of the item being drug'
    },
    type: {
      type: new GraphQLNonNull(DraggableTypeEnum),
      description: 'The type of entity being drug'
    }


  })
})

export default DraggerCoords
