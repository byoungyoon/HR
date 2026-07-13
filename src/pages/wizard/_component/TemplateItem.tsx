import cx from 'classnames';

type Props = {
  displayName: string;
  content: string;
  isSelected?: boolean;
  onClick?: () => void;
};

export default function TemplateItem({ displayName, content, isSelected, onClick }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      className={cx('cursor-pointer rounded-2xl border p-4 transition-all duration-200', {
        'border-custom-indigo-border bg-custom-indigo-bg/50': isSelected,
        'border-custom-slate-border bg-background hover:bg-custom-slate-bg': !isSelected,
      })}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <h4 className="text-text-main text-sm font-extrabold">{displayName}</h4>
      </div>
      <p className="text-text-side text-xs leading-normal font-medium">{content}</p>
    </div>
  );
}
