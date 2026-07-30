export function AuthMethodsSeparator() {
  return (
    <div className="my-3 flex flex-shrink items-center justify-center gap-2">
      <div className="grow basis-0 border-b border-neutral-200" />
      <span className="text-xs font-medium uppercase leading-none text-content-muted">
        or
      </span>
      <div className="grow basis-0 border-b border-neutral-200" />
    </div>
  );
}
