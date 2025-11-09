import { Parser, ProcessNodeDefinitions } from 'html-to-react'
import React from 'react'
import { useTranslation } from 'next-i18next'

const allowedTags = ['a', 'b', 'br']
const selfClosingTags = ['br']

type HTMLReactParserTag = {
  type: string
  name: string
  attribs: { [key: string]: string }
}

function useTranslationWithHTMLParser(translationKey: string) {
  const { t, ready } = useTranslation(translationKey)

  const parseHTML = (htmlText: string) => {
    // @ts-ignore
    const processNodeDefinitions = new ProcessNodeDefinitions(React)

    const processNode = (
      node: HTMLReactParserTag,
      children: React.ReactNode[],
      index: number
    ): React.ReactNode => {
      if (allowedTags.includes(node.name)) {
        const processedProps = { ...node.attribs }
        const processedChildren = children.map((child, childIndex) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { key: childIndex })
          }
          return child
        })

        if (selfClosingTags.includes(node.name)) {
          return React.createElement(node.name, processedProps)
        }

        return React.createElement(node.name, processedProps, processedChildren)
      }

      return processNodeDefinitions.processDefaultNode(node, children)
    }

    const processingInstructions = [
      {
        shouldProcessNode: (node: HTMLReactParserTag) => {
          return node.type === 'tag' && allowedTags.includes(node.name)
        },
        processNode,
      },
      {
        shouldProcessNode: () => true,
        processNode,
      },
    ]
    // @ts-ignore
    const htmlParser = new Parser()

    return htmlParser.parseWithInstructions(
      htmlText,
      () => true,
      processingInstructions
    )
  }

  const tWithHTMLParser = (key: string, options?: any) => {
    const translation = t(key, options)
    return parseHTML(translation)
  }

  return { t: tWithHTMLParser }
}

export default useTranslationWithHTMLParser
