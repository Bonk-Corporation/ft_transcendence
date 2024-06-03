import {ShopItem} from '../../components/Shop/ShopItem';
import { useContext, useEffect, useState } from 'preact/hooks';
import { ProfileContext, LangContext } from '../../Contexts';

export function Shop({ fetchProfile }) {
  const [page, setPage] = useState(0);
  const [items, setItems] = useState(null);

  const [factor, setFactor] = useState(window.screen.width < 768 ? 8 : 12);

  useEffect(() => {
    if (items == null) {
      fetch("/api/shop").then((res) =>
        res.json().then((data) => {
          setItems(data.items);
        }),
      );
    }

    window.addEventListener("resize", () => {
      setFactor(window.screen.width < 768 ? 8 : 12);
    });
    return () => {
      window.removeEventListener("resize", () => {
        setFactor(window.screen.width < 768 ? 8 : 12);
      });
    };
  }, []);

  const profile = useContext(ProfileContext);
	const lang = useContext(LangContext);

  return (
    <div
      className={`flex flex-col items-center transition-all duration-300 ${items ? "opacity-100" : "opacity-0"}`}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 my-4">
        {items
          ? items
              .slice(page * factor, (page + 1) * factor)
              .map((item, idx) => (
                <ShopItem
                  item={item}
                  lang={lang}
                  possessed={
                    profile ? profile.skins.includes(item.name) : false
                  }
                  selected={profile ? profile.selectedSkin == item.name : false}
                  profile={profile}
                  fetchProfile={fetchProfile}
                />
              ))
          : null}
      </div>
      {items ? (
        <div className="flex items-center">
          <svg
            onClick={() => {
              setPage(page > 0 ? page - 1 : page);
            }}
            className={`w-6 ${page <= 0 ? "fill-white/40 hover:cursor-auto" : "fill-white/60 cursor-pointer hover:fill-white"}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 512"
          >
            <path d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z" />
          </svg>
          <h1 className="select-none">{page + 1}</h1>
          <svg
            onClick={() => {
              setPage(page + 1 < items.length / factor ? page + 1 : page);
            }}
            className={`w-6 ${page + 1 >= items.length / factor ? "fill-white/40 hover:cursor-auto" : "fill-white/60 cursor-pointer hover:fill-white"}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 512"
          >
            <path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z" />
          </svg>
        </div>
      ) : null}
    </div>
  );
}
