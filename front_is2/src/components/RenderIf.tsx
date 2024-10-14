interface RenderProps {
  children: JSX.Element;
  isTrue: boolean;
}

export const RenderIf = ({ children, isTrue }: RenderProps) => {
  return isTrue ? children : null;
};
