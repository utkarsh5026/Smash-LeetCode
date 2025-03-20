import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";
import type { SyntaxHighlighterProps } from "react-syntax-highlighter";
interface SyntaxProps {
  language: string;
  code: string;
  styleAnalysis: {
    suggestions: { line: number; type: string }[];
  };
  extraProps?: SyntaxHighlighterProps;
}

const Syntax: React.FC<SyntaxProps> = ({
  language,
  code,
  styleAnalysis,
  extraProps,
}) => {
  return (
    <SyntaxHighlighter
      language={language.toLowerCase()}
      style={vs2015}
      showLineNumbers={true}
      wrapLines={true}
      lineProps={(lineNumber) => {
        const isHighlighted = styleAnalysis.suggestions.some(
          (s) => s.line === lineNumber
        );
        return {
          style: {
            display: "block",
            backgroundColor: isHighlighted
              ? "rgba(255, 170, 0, 0.15)"
              : undefined,
          },
          className: isHighlighted ? "highlighted-line" : undefined,
        };
      }}
      {...extraProps}
    >
      {code}
    </SyntaxHighlighter>
  );
};

export default Syntax;
