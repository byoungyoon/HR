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
      className={cx(
        'flex cursor-pointer flex-col gap-1.5 rounded-2xl border p-4.5 transition-all duration-200 select-none',
        {
          'border-custom-indigo bg-custom-indigo-bg/25': isSelected,
          'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/30': !isSelected,
        }
      )}
    >
      <h4
        className={cx('text-sm font-black transition-colors', {
          'text-custom-indigo': isSelected,
          'text-slate-850': !isSelected,
        })}
      >
        {displayName}
      </h4>
      <p
        className={cx('text-xs leading-relaxed font-semibold transition-colors', {
          'text-custom-indigo/75': isSelected,
          'text-slate-500': !isSelected,
        })}
      >
        {content}
      </p>
    </div>
  );
}
