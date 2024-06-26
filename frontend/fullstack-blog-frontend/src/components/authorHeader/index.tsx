import React, { Suspense } from "react";
import Image from "next/image";

import { fetchUserByIdQuery } from "../../fetchApi/fetchApi";

import { SkeletonAuthorHeader, ToastComponent } from "../../components";

import cs from "../../scss/helpers.module.scss";
import s from "./authorHeader.module.scss";

import Facebook from "../../../public/img/facebook.svg";
import Twitter from "../../../public/img/twitter.svg";
import Instagram from "../../../public/img/instagram.svg";
import Linkedin from "../../../public/img/linkedin.svg";
import DefaultImage from "../../../public/img/default/user.png";

const socialIcons = {
  facebook: <Facebook aria-hidden="true" />,
  twitter: <Twitter aria-hidden="true" />,
  instagram: <Instagram aria-hidden="true" />,
  linkedin: <Linkedin aria-hidden="true" />,
};

type AuthorHeaderSuspenseProps = {
  id: string;
};

export const AuthorHeader: React.FC<AuthorHeaderSuspenseProps> = async ({ id }) => {
  const { data: user, args } = await fetchUserByIdQuery(id);

  if (!user) {
    return (
      <>
        <SkeletonAuthorHeader />
        <ToastComponent type="warning" args={args} text="Failed to load some data." />
      </>
    );
  }

  return (
    <section className={s.root}>
      <h2 className={cs.srOnly}>{`Information about ${user.fullname}.`}</h2>

      <div className={`${s.container} ${cs.container} ${cs.container1024}`}>
        <div className={s.imageWrapper}>
          <div className={s.imageWrapperInner}>
            <Image
              src={user.imageUrl ? user.imageUrl : DefaultImage}
              alt={`Picture of ${user.fullname}`}
              className={s.image}
              fill
              sizes="293px"
            />
          </div>
        </div>

        <div className={s.text}>
          <p className={s.title}>{`Hey there, I'm ${user.fullname} and welcome to my Blog`}</p>

          <p className={s.descr}>{user.representation}</p>

          <ul className={s.social}>
            {Object.entries(socialIcons).map(([title, icon], i) => {
              const link = user.userLinks[title];
              if (link === "") return;

              return (
                <li key={i} className={s.socialItem}>
                  <a
                    href={link}
                    target="_blank"
                    className={`${cs.socialBtn} ${cs.socialBtnDark}`}
                    aria-label={`Go to the ${title} of ${user.fullname}`}>
                    {icon}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={`${s.decoration} ${cs.decoration}`}>
          <span className={`${cs.decorationItem} ${cs.decorationItemYellow}`}></span>
          <span className={`${cs.decorationItem} ${cs.decorationItemYellow}`}></span>
        </div>
      </div>
    </section>
  );
};

// **
// type AuthorHeaderProps = {
//   id: string;
// };

// export const AuthorHeader: React.FC<AuthorHeaderProps> = ({ id }) => (
//   <Suspense fallback={<SkeletonAuthorHeader />}>
//     <AuthorHeaderSuspense id={id} />
//   </Suspense>
// );

// export const AuthorHeader: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const id = useParams().id.toString();

//   const { data: user, isError, originalArgs, endpointName } = useGetUserByIdQuery(id);

//   // **
//   React.useEffect(() => {
//     if (isError) {
//       dispatch(
//         setToast({
//           type: "warning",
//           args: endpointName + "" + originalArgs,
//           text: "Failed to load some data.",
//         }),
//       );
//     }
//   }, [isError]);

//   // **
//   if (!user) {
//     return <SkeletonAuthorHeader />;
//   }

//   return (
//     <section className={s.root}>
//       <h2 className={cs.srOnly}>{`Information about ${user.fullname}.`}</h2>

//       <div className={`${s.container} ${cs.container} ${cs.container1024}`}>
//         <div className={s.imageWrapper}>
//           <div className={s.imageWrapperInner}>
//             <Image
//               src={user.imageUrl ? user.imageUrl : DefaultImage}
//               alt={`Picture of ${user.fullname}`}
//               className={s.image}
//               fill
//               sizes="293px"
//             />
//           </div>
//         </div>

//         <div className={s.text}>
//           <p className={s.title}>{`Hey there, I'm ${user.fullname} and welcome to my Blog`}</p>

//           <p className={s.descr}>{user.representation}</p>

//           <ul className={s.social}>
//             {Object.entries(socialIcons).map(([title, icon], i) => {
//               const link = user.userLinks[title];
//               if (link === "") return;

//               return (
//                 <li key={i} className={s.socialItem}>
//                   <a
//                     href={link}
//                     target="_blank"
//                     className={`${cs.socialBtn} ${cs.socialBtnDark}`}
//                     aria-label={`Go to the ${title} of ${user.fullname}`}>
//                     {icon}
//                   </a>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>

//         <div className={`${s.decoration} ${cs.decoration}`}>
//           <span className={`${cs.decorationItem} ${cs.decorationItemYellow}`}></span>
//           <span className={`${cs.decorationItem} ${cs.decorationItemYellow}`}></span>
//         </div>
//       </div>
//     </section>
//   );
// };
