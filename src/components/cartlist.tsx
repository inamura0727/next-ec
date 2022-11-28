// import styles from '../../styles/Home.module.css';
// import Image from 'next/image';
// import Link from 'next/link';
// import useSWR, { useSWRConfig } from 'swr';
// import { UserCart } from 'types/user';
// import { withIronSessionSsr } from 'iron-session/next';
// import { ironOptions } from '../../lib/ironOprion';
// import { User } from 'types/user';

// const fetcher = (resource: string) =>
//   fetch(resource).then((res) => res.json());


// // export const getServerSideProps = withIronSessionSsr(
// //   async function getServerSideProps({ req }) {
// //     const user = req.session.user;

// //     if (user === undefined) {
// //       return {
// //         notFound: true,
// //       };
// //     }
// //     return {
// //       props: {
// //         user: req.session.user,
// //       },
// //     };
// //   },
// //   ironOptions
// // );

// export default function CartList({user}:{user:User}) {
//   // const id = user.id
//   console.log(user)
//   const { data, error } = useSWR(`/api/users/2`, fetcher);
//   // ユーザーのidを取得予定
//   if (error) return <div>Failed to load</div>;

//   if (!data) return <div>loading</div>;

//   const items = data.userCarts;
//   // console.log(data.userCarts);

//   return (
//     <>
//       {items.map((item: UserCart) => {
//         return (
//           <div className="cart-content" key={item.id}>
//             <div className="cart-media">
//               <div className="cart-inner">
//                 <figure className="cart-img-wrapper">
//                   <div key={item.id}>
//                     <Image
//                       className="cart-img"
//                       src={item.itemImage}
//                       width={200}
//                       height={150}
//                       alt="商品の画像"
//                     />
//                     <p>{item.itemName}</p>
//                     <p>{item.price}</p>
//                   </div>
//                 </figure>
//                 <div className="cart-body">
//                   <div className="cart-title">
//                     <p className="cart-artists"></p>
//                     <p className="cart-period">レンタル期間</p>
//                     <Link href="" legacyBehavior>
//                       <a>詳細ページへ</a>
//                     </Link>
//                   </div>
//                   <p className="cart-price"></p>
//                 </div>
//               </div>
//               <div className="cart-btn-wrapper">
//                 <button className="cart-before-btn">削除</button>
//               </div>
//             </div>
//             <style jsx>
//               {`
//                 .cart-content {
//                   max-width: 1230px;
//                   padding: 15px;
//                   margin: 0 auto;
//                 }
//                 .cart-media {
//                   border: 1px solid #333;
//                   padding: 10px;
//                 }
//                 .cart-img {
//                   width: 100%;
//                 }
//                 .cart-inner {
//                   display: flex;
//                   align-items: center;
//                 }
//                 .cart-btn-wrapper {
//                   text-align: right;
//                 }
//                 .cart-before-btn {
//                   padding: 5px 10px;
//                   border: 1px solid #333;
//                   border-radius: 10px;
//                 }
//               `}
//             </style>
//           </div>
//         );
//       })}
//     </>
//   );
// }
