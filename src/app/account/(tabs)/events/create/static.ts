export interface OptionFieldData {
  id: string;
  label: string;
  description?: string;
  items: Array<{
    key: string;
    label: string;
    value: string | number;
    description?: string;
  }>;
  placeholder?: string;
}
export const ticket_count_options: OptionFieldData = {
  id: "ticket_count",
  label: "Tickets",
  items: [
    {
      key: "50",
      value: 50,
      label: "50",
    },
    {
      key: "100",
      value: 100,
      label: "50-100",
    },
    {
      key: "500",
      value: 500,
      label: "100-500",
    },
    {
      key: "1000",
      value: 1000,
      label: "500-1000",
    },
    {
      key: "2000",
      value: 2000,
      label: "1000-2000",
    },
    {
      key: "5000",
      value: 5000,
      label: "2000-5000",
    },
  ],
};

export const event_type_options: OptionFieldData = {
  id: "event_type",
  label: "Event Type",
  items: [
    {
      key: "onsite",
      value: "onsite",
      label: "Onsite",
      description: "Takes place in a physical location.",
    },
    {
      key: "online",
      value: "online",
      label: "Online",
      description: "Events that take place online.",
    },
  ],
};

export const category_options: OptionFieldData = {
  id: "category",
  label: "category",
  items: [
    {
      key: "live",
      value: "live",
      label: "Concerts & Music Festivals",
      description: "live music performance",
    },
    {
      key: "sports",
      value: "sports",
      label: "Sports Events",
    },
    {
      key: "theater",
      value: "theater",
      label: "Theater & Performing Arts",
      description: "theater arts",
    },
    {
      key: "seminar",
      value: "seminar",
      label: "Conferences & Seminars",
      description: "training seminar",
    },
    {
      key: "exhibition",
      value: "exhibition",
      label: "Exhibitions & Trade Shows",
      description: "trade shows",
    },
    {
      key: "festival",
      value: "festical",
      label: "Festivals & Cultural Events",
      description: "cultural events",
    },
    {
      key: "party",
      value: "party",
      label: "Nightlife & Parties",
      description: "parties",
    },
    {
      key: "egames",
      value: "egames",
      label: "Gaming & eSports",
      description: "egames",
    },
    {
      key: "online",
      value: "online",
      label: "Online & Virtual Events",
      description: "online",
    },
    {
      key: "training",
      value: "training",
      label: "Training & Workshops",
      description: "online",
    },
    {
      key: "hackaton",
      value: "hackaton",
      label: "Hackaton",
      description: "hackaton",
    },
    {
      key: "rocket",
      value: "launch",
      label: "Rocket Launch",
      description: "rocket launch",
    },
  ],
};
