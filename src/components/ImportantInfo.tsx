import { BadgeInfo, Globe2, Landmark, Phone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ImportantInfo as ImportantInfoType } from '../data/trip';
import { valueOrEmpty } from '../utils/format';

interface ImportantInfoProps {
  info: ImportantInfoType;
}

export function ImportantInfo({ info }: ImportantInfoProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <InfoCard icon={BadgeInfo} title="護照 / 入境" content={valueOrEmpty(info.passportVisa)} />
      <InfoCard icon={Phone} title="緊急聯絡" content={valueOrEmpty(info.emergencyContact)} />
      <InfoCard icon={Globe2} title="網路 SIM / eSIM" content={valueOrEmpty(info.internet)} />
      <InfoCard icon={Landmark} title="貨幣與付款" content={valueOrEmpty(info.currencyNote)} />
    </div>
  );
}

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  content: string;
}

function InfoCard({ icon: Icon, title, content }: InfoCardProps) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <div className="mb-3 flex items-center gap-3">
        <Icon className="h-5 w-5 text-teal-700 dark:text-teal-300" aria-hidden="true" />
        <h3 className="text-lg font-bold text-stone-950 dark:text-white">{title}</h3>
      </div>
      <p className="text-sm leading-7 text-stone-600 dark:text-stone-300">{content}</p>
    </article>
  );
}
