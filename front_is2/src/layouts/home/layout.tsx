interface Props {
  children: React.ReactNode;
}
const HomeLayout = ({ children }: Props) => {
  return <div>{children}</div>;
};
export default HomeLayout;
