"use client";

import qs from "qs";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { useGetTestimonialQuery } from "../../../redux/backendApi";
import { useAppDispatch } from "../../../redux/store";
import { setToast } from "../../../redux/toastSlice/slice";

import {
  NotFoundData,
  Pagination,
  Select,
  SkeletonTestimonial,
  Testimonial,
} from "../../../components";
import { getSortingIndex } from "../../../utils/customFunctions";

import cs from "../../../scss/helpers.module.scss";
import s from "./changeTestimonialsBlock.module.scss";

const sorting = [
  { title: "Newer", code: "+createdAt" },
  { title: "Older", code: "-createdAt" },
] as const;

type SortingCode = (typeof sorting)[number]["code"];

const defaultHeight = 160;
const limit = 2;

export const ChangeTestimonialsBlock: React.FC = () => {
  const dispatch = useAppDispatch();
  const listRef = React.useRef<HTMLUListElement>(null);
  const timer = React.useRef<NodeJS.Timeout>();

  // **
  const isRouter = React.useRef(true);
  const [isNavigate, setIsNavigate] = React.useState<boolean | {}>(false);

  const searchParams = useSearchParams().toString();
  const router = useRouter();

  const getUrlSearch = () => {
    const urlSP = qs.parse(searchParams, { arrayLimit: 1000 });
    const urlPage = Number(urlSP._page || "1");
    const urlSearch = String(urlSP._q || "");
    const urlSort = (urlSP._sort as SortingCode) || sorting[0].code;

    return { urlPage, urlSearch, urlSort };
  };
  const { urlPage, urlSearch, urlSort } = getUrlSearch();

  const [page, setPage] = React.useState(urlPage);
  const [search, setSearch] = React.useState(urlSearch);
  const [sort, setSort] = React.useState(urlSort);

  class Request {
    _page = page;
    _limit = limit;
    _q = search;

    _order;
    _sort;

    constructor(isExtend: boolean) {
      this._order = isExtend ? (sort.startsWith("-") ? "asc" : "desc") : undefined;
      this._sort = isExtend ? sort.slice(1, sort.length) : sort;
    }
  }

  let requestLocal = `?${qs.stringify(new Request(false), { encode: true })}`;
  let request = `?${qs.stringify(new Request(true), { encode: true })}`;

  const { data, isError, refetch, originalArgs, endpointName } = useGetTestimonialQuery(request);
  const testimonials = data?.data;
  const totalCount = data?.totalCount;
  const totalPages = Math.ceil((totalCount || 1) / limit);

  const [activeOption, setActiveOption] = React.useState(getSortingIndex(sorting, sort));

  // **
  React.useEffect(() => {
    if (isError) {
      dispatch(
        setToast({
          type: "warning",
          args: endpointName + "" + originalArgs,
          text: "Failed to load data.",
        }),
      );
    }
  }, [isError]);

  // **
  React.useEffect(() => {
    if (!isRouter.current) {
      setPage(urlPage);
    }

    isRouter.current = false;
  }, [searchParams]);

  // **
  React.useEffect(() => {
    if (isNavigate) {
      router.push(requestLocal);
      isRouter.current = true;
    }
  }, [isNavigate]);

  // **
  React.useEffect(() => {
    if (!listRef.current) return;
    const textBtns = listRef.current.querySelectorAll("button");

    textBtns.forEach((btn) => {
      const text = btn.nextElementSibling;
      if (!text) return;

      const textSH = text.scrollHeight;
      if (textSH > defaultHeight) {
        btn.setAttribute("data-text-btn-visible", "");
      }
    });
  });

  // **
  const refetchTestimonialsAfterDelete = () => {
    if (testimonials?.length === 1 && page > 1) {
      setPage((n) => n - 1);
      setIsNavigate({});

      return;
    }

    refetch();
  };

  // **
  const onSelectChange = (option: number) => {
    setActiveOption(option);

    setSort(sorting[option].code);
    setPage(1);
    setIsNavigate({});
  };

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      setSearch(e.target.value);
      setPage(1);

      setIsNavigate({});
    }, 250);
  };

  const onPageChange = ({ selected }: Record<string, number>) => {
    setPage(selected + 1);
    setIsNavigate({});
  };

  return (
    <section className={s.root}>
      <h2 className={`${s.title} ${cs.title}`}>Testimonials</h2>

      <div className={`${s.tooltip} ${cs.tooltip}`}>
        <input
          defaultValue={search}
          onChange={onSearchChange}
          type="text"
          placeholder="Search"
          className={`${s.input} ${cs.input}`}
        />

        <Select
          classNameInput={cs.input}
          sorting={sorting}
          activeOption={activeOption}
          onSelectChange={onSelectChange}
        />
      </div>

      <Link href="/dashboard/change/testimonials/create" className={`${s.btn} ${cs.btn}`}>
        Create new testimonial
      </Link>

      {testimonials?.length === 0 ? (
        <NotFoundData />
      ) : (
        <ul className={s.list} ref={listRef}>
          {!testimonials
            ? [...Array(2)].map((_, i) => (
                <li key={i} className={s.item}>
                  <SkeletonTestimonial isDashboard={true} />
                </li>
              ))
            : testimonials.map((obj, i) => (
                <li key={obj.id} className={s.item}>
                  <Testimonial
                    obj={obj}
                    index={0}
                    currentSlide={0}
                    isEditable={true}
                    refetch={refetchTestimonialsAfterDelete}
                  />
                </li>
              ))}
        </ul>
      )}

      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </section>
  );
};
