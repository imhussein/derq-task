type ReactFragmentProps = {
  children: React.ReactNode | React.ReactNode[];
};

export function ReactFragment({ children }: ReactFragmentProps) {
  return <>{children}</>;
}
