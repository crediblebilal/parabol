import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import jiraSVG from '../../../styles/theme/images/graphics/jira.svg'
import relativeDate from '../../../utils/date/relativeDate'
import {Link} from '@mui/icons-material'
import useTooltip from '../../../hooks/useTooltip'
import {MenuPosition} from '../../../hooks/useCoords'
import {useFragment} from 'react-relay'
import graphql from 'babel-plugin-relay/macro'
import {JiraObjectCard_result$key} from '../../../__generated__/JiraObjectCard_result.graphql'
import {mergeRefs} from '../../../utils/react/mergeRefs'

interface Props {
  resultRef: JiraObjectCard_result$key
}

const JiraObjectCard = (props: Props) => {
  const {resultRef} = props

  const result = useFragment(
    graphql`
      fragment JiraObjectCard_result on JiraIssue {
        id
        summary
        url
        issueKey
        cloudName
        issueIcon
        lastUpdated
        project {
          name
          key
        }
      }
    `,
    resultRef
  )

  const {tooltipPortal, openTooltip, closeTooltip, originRef} = useTooltip<HTMLDivElement>(
    MenuPosition.UPPER_CENTER
  )

  const {
    tooltipPortal: copiedTooltipPortal,
    openTooltip: openCopiedTooltip,
    closeTooltip: closeCopiedTooltip,
    originRef: copiedTooltipRef
  } = useTooltip<HTMLDivElement>(MenuPosition.LOWER_CENTER)

  const handleCopy = () => {
    openCopiedTooltip()
    setTimeout(() => {
      closeCopiedTooltip()
    }, 2000)
  }

  const {summary, url, issueKey, project, cloudName, issueIcon, lastUpdated} = result

  return (
    <div className='rounded border border-solid border-slate-300 p-4 hover:border-slate-600'>
      <div className='flex gap-2 text-xs text-slate-600'>
        <img src={issueIcon} />
        <a
          href={url}
          target='_blank'
          className='font-semibold text-slate-600 hover:underline'
          rel='noreferrer'
        >
          {issueKey}
        </a>
        <div>Updated {relativeDate(lastUpdated)}</div>
      </div>
      <div className='my-2 text-sm'>
        <a href={url} target='_blank' className='hover:underline' rel='noreferrer'>
          {summary}
        </a>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='h-4 w-4'>
            <img src={jiraSVG} />
          </div>
          {project && (
            <a
              href={`https://${cloudName}.atlassian.net/browse/${project.key}`}
              target='_blank'
              className='text-xs text-slate-600 hover:underline'
              rel='noreferrer'
            >
              {project.name}
            </a>
          )}
        </div>
        <CopyToClipboard text={url} onCopy={handleCopy}>
          <div
            className='h-6 rounded-full bg-transparent p-0 text-slate-500 hover:bg-slate-200'
            onMouseEnter={openTooltip}
            onMouseLeave={closeTooltip}
            ref={mergeRefs(originRef, copiedTooltipRef)}
          >
            <Link className='h-6 w-6 cursor-pointer p-0.5' />
          </div>
        </CopyToClipboard>
        {tooltipPortal('Copy link')}
        {copiedTooltipPortal('Copied!')}
      </div>
    </div>
  )
}

export default JiraObjectCard
