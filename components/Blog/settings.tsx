import {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type BlogSettings = {
  showCommitInformation: boolean;
};

type BlogSettingsContextValue = {
  settings: BlogSettings;
  setShowCommitInformation: (show: boolean) => void;
};

const BLOG_SETTINGS_STORAGE_KEY = "blog-settings-v1";

const defaultBlogSettings: BlogSettings = {
  showCommitInformation: false,
};

const BlogSettingsContext = createContext<BlogSettingsContextValue | null>(
  null,
);

function loadBlogSettingsFromStorage(): BlogSettings {
  if (typeof window === "undefined") {
    return defaultBlogSettings;
  }

  const raw = window.localStorage.getItem(BLOG_SETTINGS_STORAGE_KEY);
  if (raw == null) {
    return defaultBlogSettings;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<BlogSettings>;
    return {
      ...defaultBlogSettings,
      ...parsed,
    };
  } catch {
    return defaultBlogSettings;
  }
}

export function BlogSettingsProvider({ children }: PropsWithChildren) {
  const [settings, setSettings] = useState<BlogSettings>(defaultBlogSettings);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  useEffect(() => {
    setSettings(loadBlogSettingsFromStorage());
    setHasLoadedFromStorage(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedFromStorage) {
      return;
    }
    window.localStorage.setItem(
      BLOG_SETTINGS_STORAGE_KEY,
      JSON.stringify(settings),
    );
  }, [hasLoadedFromStorage, settings]);

  const value = useMemo<BlogSettingsContextValue>(
    () => ({
      settings,
      setShowCommitInformation: (show) => {
        setSettings((current) => ({
          ...current,
          showCommitInformation: show,
        }));
      },
    }),
    [settings],
  );

  return (
    <BlogSettingsContext.Provider value={value}>
      {children}
    </BlogSettingsContext.Provider>
  );
}

export function useBlogSettings(): BlogSettingsContextValue {
  const context = useContext(BlogSettingsContext);
  if (context == null) {
    throw new Error(
      "useBlogSettings must be used within a BlogSettingsProvider",
    );
  }
  return context;
}
