'use client'

import { useEffect, useRef } from 'react';
import renderMathInElement from 'katex/dist/contrib/auto-render';
import 'katex/dist/katex.min.css';

interface IPropsKatex {
  text: any
}
export default function LynxKatexEditor(props: IPropsKatex): React.JSX.Element {
  const katexTextRef = useRef();

  const { ...delegated } = props

  useEffect(() => {
    if (katexTextRef.current) {
      renderMathInElement(katexTextRef.current, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false }
        ]
      });
    }
  }, []);
  return (
    <div ref={katexTextRef} {...delegated}>
      {props?.text}
    </div>
  )
}