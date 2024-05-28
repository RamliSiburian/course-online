
import katex from 'katex';

interface IPropsLynxKatex {
  text: any
}

export default function LynxKatex(props: IPropsLynxKatex): React.JSX.Element {
  const MathRenderer = ({ text }: any) => {
    const html = katex.renderToString(text, {
      throwOnError: false
    });

    return (
      <div
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  return (
    <div className='!w-full'>
      < MathRenderer text={props?.text} />
    </div>
  )
} 