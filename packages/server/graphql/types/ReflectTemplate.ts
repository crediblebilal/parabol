import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString
} from 'graphql'
import connectionDefinitions from '../connectionDefinitions'
import {GQLContext} from '../graphql'
import GraphQLISO8601Type from './GraphQLISO8601Type'
import RetroPhaseItem from './RetroPhaseItem'
import SharingScopeEnum from './SharingScopeEnum'

const ReflectTemplate = new GraphQLObjectType<any, GQLContext>({
  name: 'ReflectTemplate',
  description: 'The team-specific templates for the reflection prompts',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID)
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLISO8601Type)
    },
    isActive: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'True if template can be used, else false'
    },
    lastUsedAt: {
      type: GraphQLISO8601Type,
      description: 'The time of the meeting the template was last used'
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'The name of the template'
    },
    prompts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(RetroPhaseItem))),
      description: 'The prompts that are part of this template',
      resolve: async ({id: promptTemplateId, teamId}, _args, {dataLoader}) => {
        const phaseItems = await dataLoader.get('customPhaseItemsByTeamId').load(teamId)
        const prompts = phaseItems.filter(({templateId}) => templateId === promptTemplateId)
        prompts.sort((a, b) => (a.sortOrder < b.sortOrder ? -1 : 1))
        return prompts
      }
    },
    orgId: {
      type: GraphQLNonNull(GraphQLID),
      description: '*Foreign key. The organization that owns the team that created the template'
    },
    scope: {
      type: GraphQLNonNull(SharingScopeEnum),
      description: 'Who can see this template'
    },
    teamId: {
      type: new GraphQLNonNull(GraphQLID),
      description: '*Foreign key. The team this template belongs to'
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLISO8601Type)
    }
  })
})

const {connectionType, edgeType} = connectionDefinitions({
  name: ReflectTemplate.name,
  nodeType: ReflectTemplate
})

export const ReflectTemplateConnection = connectionType
export const ReflectTemplateEdge = edgeType
export default ReflectTemplate
