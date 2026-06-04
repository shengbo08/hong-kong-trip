import { Hospital, MapPin, Phone, ShieldPlus } from 'lucide-react';
import type { EmergencyContact } from '../data/trip';
import { valueOrEmpty } from '../utils/format';
import { EmptyState } from './EmptyState';
import { MapButton } from './MapButton';

interface EmergencyContactsProps {
  contacts: EmergencyContact[];
}

export function EmergencyContacts({ contacts }: EmergencyContactsProps) {
  if (contacts.length === 0) return <EmptyState />;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {contacts.map((contact) => (
        <article key={contact.id} className="rounded-lg border border-red-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <span className="rounded-lg bg-red-50 p-3 text-red-700">
              {contact.category.includes('醫院') ? (
                <Hospital className="h-5 w-5" aria-hidden="true" />
              ) : (
                <ShieldPlus className="h-5 w-5" aria-hidden="true" />
              )}
            </span>
            <div>
              <p className="text-sm font-semibold text-red-700">{contact.category}</p>
              <h3 className="text-lg font-bold text-stone-950">{contact.name}</h3>
            </div>
          </div>
          <p className="flex gap-2 text-sm leading-6 text-stone-700">
            <Phone className="mt-1 h-4 w-4 shrink-0 text-red-700" />
            {valueOrEmpty(contact.phone)}
          </p>
          <p className="mt-2 flex gap-2 text-sm leading-6 text-stone-600">
            <MapPin className="mt-1 h-4 w-4 shrink-0 text-red-700" />
            {valueOrEmpty(contact.address)}
          </p>
          <div className="mt-4">
            <MapButton url={contact.googleMapsUrl} />
          </div>
        </article>
      ))}
    </div>
  );
}
