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
      className={cx('cursor-pointer rounded-2xl border-2 p-4 transition-all duration-200', {
        'border-blue-600 bg-blue-50/10': isSelected,
        'border-slate-200 bg-white hover:bg-slate-50': !isSelected,
      })}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <h4 className="text-xs font-extrabold text-slate-900">{displayName}</h4>
      </div>
      <p className="text-slate-550 text-[10.5px] leading-normal font-medium">{content}</p>
    </div>
  );
}
