import { use, useActionState, useCallback, useMemo } from "react";
import type { PexelParamItem, PexelParams, QueryData } from "./types";
import { Avatar, Button, Form, Select, SelectItem } from "@nextui-org/react";
import { HyperList } from "@/ui/list";
import { cn } from "@/lib/utils";
import { EventEditorCtx } from "../../ctx";
import { SidebarCtx } from "@/app/ctx/sidebar";
import { Iconx } from "@/icons/icon";

export const PexelParamList = ({ category }: { category?: string }) => {
  const { toggle } = use(SidebarCtx)!;
  //PARAMS
  const params: PexelParams[] = useMemo(
    () => [
      {
        id: 0,
        param: "query",
        label: "search query",
        description: "Image search query.",
        items: queries,
      },
      {
        id: 1,
        param: "locale",
        label: "origin",
        description: "Image origin or locale.",
        items: locales,
      },
    ],
    [],
  );

  const { updateQueryParams } = use(EventEditorCtx)!;

  const initialState: QueryData = useMemo(
    () => ({ query: category ?? "party", locale: "en-US" }),
    [category],
  );

  const handleSubmit = useCallback(
    (state: QueryData, fd: FormData) => {
      const data: QueryData = {
        query: fd.get("query") as string,
        locale: fd.get("locale") as string,
      };
      if (data) {
        updateQueryParams(data.query, data.locale);
        toggle();
        return data;
      }
      return state;
    },
    [updateQueryParams, toggle],
  );
  const [state, action] = useActionState(handleSubmit, initialState);

  const PexelListItem = useCallback(
    (data: PexelParams) => (
      <Select
        id={data.param}
        defaultSelectedKeys={
          data.param === "query"
            ? [state.query ?? initialState.locale ?? "party"]
            : [state.locale ?? initialState.locale ?? "jp-JA"]
        }
        selectorIcon={<Iconx name="arrow-down-01" />}
        name={data.param}
        key={data.id}
        label={<div className="flex items-center gap-1">{data.label}</div>}
        size="lg"
        className="w-full rounded-xl bg-white"
        classNames={{
          base: "",
          popoverContent: "pointer-events-auto",
          trigger:
            "font-semibold h-16 hover:bg-chalk shadow-none border-[0.33px] bg-white border-macd-gray rounded-xl",
          label:
            "text-xs pb-2 md:text-sm tracking-wide font-light capitalize opacity-80",
        }}
        items={data.items}
        variant="flat"
        renderValue={(items) => {
          return items.map((item, i) => (
            <div
              id={`${item.key}_` + i}
              key={`${item.key}_` + i}
              className="flex items-center justify-between"
            >
              <div className="flex gap-2">
                {data.param === "locale" ? (
                  <Avatar
                    alt={item.textValue}
                    className="h-6 w-6"
                    src={`https://flagcdn.com/${item.data?.id.split("-")[1]?.toLowerCase()}.svg`}
                    fallback={
                      <p className="text-[10px] uppercase">
                        {item.data?.id.split("-")[1]?.toUpperCase()}
                      </p>
                    }
                  />
                ) : null}

                <span className="font-medium capitalize tracking-tight">
                  {item.data?.value}
                </span>
              </div>
              <span className="text-sm font-normal capitalize tracking-tight">
                {item.data?.category}
              </span>
            </div>
          ));
        }}
      >
        {(item) => (
          <SelectItem
            selectedIcon={(item) => (
              <Iconx
                name="check"
                className={cn("hidden size-3 text-teal-600", {
                  flex: item.isSelected,
                })}
              />
            )}
            className="w-full capitalize"
            startContent={
              data.param === "locale" ? (
                <Avatar
                  alt={item.value}
                  className="h-6 w-6"
                  src={`https://flagcdn.com/${item.id.split("-")[1]?.toLowerCase()}.svg`}
                  fallback={
                    <p className="text-[10px] uppercase">
                      {item.id.split("-")[1]?.toUpperCase()}
                    </p>
                  }
                />
              ) : null
            }
            classNames={{
              title: "capitalize",
              base: "capitalize",
            }}
            key={item.id}
            textValue={item.value}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="capitalize">{item.value}</span>
              <span className="text-xs font-light">{item.category}</span>
            </div>
          </SelectItem>
        )}
      </Select>
    ),
    [initialState, state],
  );

  return (
    <Form
      action={action}
      className="w-full space-y-4 overflow-hidden rounded-xl"
    >
      <HyperList
        container="space-y-4 w-full py-2"
        data={params}
        component={PexelListItem}
        keyId="id"
      />
      <div className="w-full px-2">
        <div className="h-px bg-gray-200" />
      </div>
      <Button
        size="lg"
        type="submit"
        variant="solid"
        color="primary"
        radius="md"
        className="w-full"
      >
        Search Image
      </Button>
    </Form>
  );
};

const locales: PexelParamItem[] = [
  {
    id: "en-US",
    description: "en-US",
    value: "United States",
    category: "English",
  },
  {
    id: "pt-BR",
    description: "pt-BR",
    value: "Brazil",
    category: "Portuguese",
  },
  { id: "es-ES", description: "es-ES", value: "Spain", category: "Spanish" },
  { id: "ca-ES", description: "ca-ES", value: "Spain", category: "Catalan" },
  { id: "de-DE", description: "de-DE", value: "Germany", category: "German" },
  { id: "it-IT", description: "it-IT", value: "Italy", category: "Italian" },
  { id: "fr-FR", description: "fr-FR", value: "France", category: "French" },
  { id: "sv-SE", description: "sv-SE", value: "Sweden", category: "Swedish" },
  {
    id: "id-ID",
    description: "id-ID",
    value: "Indonesia",
    category: "Indonesian",
  },
  { id: "pl-PL", description: "pl-PL", value: "Poland", category: "Polish" },
  { id: "ja-JP", description: "ja-JP", value: "Japan", category: "Japanese" },
  { id: "zh-TW", description: "zh-TW", value: "Taiwan", category: "Chinese" },
  { id: "zh-CN", description: "zh-CN", value: "China", category: "Chinese" },
  {
    id: "ko-KR",
    description: "ko-KR",
    value: "South Korea",
    category: "Korean",
  },
  { id: "th-TH", description: "th-TH", value: "Thailand", category: "Thai" },
  {
    id: "nl-NL",
    description: "nl-NL",
    value: "Netherlands",
    category: "Dutch",
  },
  {
    id: "hu-HU",
    description: "hu-HU",
    value: "Hungary",
    category: "Hungarian",
  },
  {
    id: "vi-VN",
    description: "vi-VN",
    value: "Vietnam",
    category: "Vietnamese",
  },
  {
    id: "cs-CZ",
    description: "cs-CZ",
    value: "Czech Republic",
    category: "Czech",
  },
  { id: "da-DK", description: "da-DK", value: "Denmark", category: "Danish" },
  { id: "fi-FI", description: "fi-FI", value: "Finland", category: "Finnish" },
  {
    id: "uk-UA",
    description: "uk-UA",
    value: "Ukraine",
    category: "Ukrainian",
  },
  { id: "el-GR", description: "el-GR", value: "Greece", category: "Greek" },
  { id: "ro-RO", description: "ro-RO", value: "Romania", category: "Romanian" },
  { id: "nb-NO", description: "nb-NO", value: "Norway", category: "Norwegian" },
  { id: "sk-SK", description: "sk-SK", value: "Slovakia", category: "Slovak" },
  { id: "tr-TR", description: "tr-TR", value: "Turkey", category: "Turkish" },
  { id: "ru-RU", description: "ru-RU", value: "Russia", category: "Russian" },
];

const queries: PexelParamItem[] = [
  {
    id: "party",
    value: "Party",
    category: "party",
    description: "Party",
  },
  {
    id: "nature",
    value: "Nature",
    category: "scenery",
    description: "Beautiful landscapes and nature views",
  },
  {
    id: "technology",
    value: "Technology",
    category: "modern",
    description: "Futuristic and tech-related visuals",
  },
  {
    id: "cityscape",
    value: "Cityscape",
    category: "urban",
    description: "City skylines, urban landscapes",
  },
  {
    id: "business",
    value: "Business",
    category: "corporate",
    description: "Office, meetings, and professional work",
  },
  {
    id: "abstract",
    value: "Abstract",
    category: "art",
    description: "Creative and conceptual images",
  },
  {
    id: "people",
    value: "People",
    category: "lifestyle",
    description: "Everyday life and human interactions",
  },
  {
    id: "fitness",
    value: "Fitness",
    category: "health",
    description: "Workout and gym-related images",
  },
  {
    id: "travel",
    value: "Travel",
    category: "adventure",
    description: "Exotic destinations and travel experiences",
  },
  {
    id: "food",
    value: "Food",
    category: "culinary",
    description: "Delicious meals, cooking, and gastronomy",
  },
  {
    id: "animals",
    value: "Animals",
    category: "wildlife",
    description: "Pets, wildlife, and animal photography",
  },
  {
    id: "art",
    value: "Art",
    category: "creative",
    description: "Drawings, paintings, and artwork",
  },
  {
    id: "fashion",
    value: "Fashion",
    category: "style",
    description: "Trendy outfits, runway, and design",
  },
  {
    id: "sports",
    value: "Sports",
    category: "athletics",
    description: "Action shots and sporting activities",
  },
  {
    id: "sunset",
    value: "Sunset",
    category: "scenery",
    description: "Golden hour, sunrise, and sunsets",
  },
  {
    id: "mountains",
    value: "Mountains",
    category: "nature",
    description: "Majestic mountain landscapes",
  },
  {
    id: "ocean",
    value: "Ocean",
    category: "nature",
    description: "Beaches, waves, and marine life",
  },
  {
    id: "cars",
    value: "Cars",
    category: "transportation",
    description: "Luxury and vintage cars",
  },
  {
    id: "music",
    value: "Music",
    category: "entertainment",
    description: "Concerts, instruments, and artists",
  },
  {
    id: "space",
    value: "Space",
    category: "science",
    description: "Planets, stars, and outer space",
  },
  {
    id: "education",
    value: "Education",
    category: "learning",
    description: "Books, students, and study materials",
  },
  {
    id: "startup",
    value: "Startup",
    category: "business",
    description: "Entrepreneurship and innovation",
  },
  {
    id: "coding",
    value: "Coding",
    category: "technology",
    description: "Programming, developers, and screens",
  },
  {
    id: "AI",
    value: "AI",
    category: "technology",
    description: "Artificial Intelligence and futuristic themes",
  },
  {
    id: "robotics",
    value: "Robotics",
    category: "technology",
    description: "Machines, robots, and automation",
  },
  {
    id: "history",
    value: "History",
    category: "culture",
    description: "Ancient artifacts and historical places",
  },
  {
    id: "architecture",
    value: "Architecture",
    category: "design",
    description: "Buildings, structures, and interiors",
  },
  {
    id: "flowers",
    value: "Flowers",
    category: "nature",
    description: "Blooming gardens and floral patterns",
  },
  {
    id: "Christmas",
    value: "Christmas",
    category: "holiday",
    description: "Festive decorations and celebrations",
  },
  {
    id: "summer",
    value: "Summer",
    category: "seasonal",
    description: "Beach, sun, and vacation vibes",
  },
  {
    id: "autumn",
    value: "Autumn",
    category: "seasonal",
    description: "Falling leaves and cozy fall colors",
  },
  {
    id: "health",
    value: "Health",
    category: "wellness",
    description: "Well-being, medicine, and healthcare",
  },
  {
    id: "meditation",
    value: "Meditation",
    category: "mindfulness",
    description: "Yoga, peace, and relaxation",
  },
  {
    id: "books",
    value: "Books",
    category: "education",
    description: "Libraries, reading, and literature",
  },
  {
    id: "coffee",
    value: "Coffee",
    category: "lifestyle",
    description: "Morning coffee and cozy vibes",
  },
  {
    id: "cybersecurity",
    value: "Cybersecurity",
    category: "technology",
    description: "Digital security and hacking concepts",
  },
  {
    id: "gaming",
    value: "Gaming",
    category: "entertainment",
    description: "Video games, consoles, and esports",
  },
  {
    id: "wedding",
    value: "Wedding",
    category: "celebration",
    description: "Bridal moments and romantic ceremonies",
  },
  {
    id: "street photography",
    value: "Street photography",
    category: "urban",
    description: "Candid shots of city life",
  },
  {
    id: "space exploration",
    value: "Space Exploration",
    category: "science",
    description: "Astronauts, rockets, and space missions",
  },
  {
    id: "film",
    value: "Film",
    category: "cinematography",
    description: "Movies, filmmaking, and cinema aesthetics",
  },
];
