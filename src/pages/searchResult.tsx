import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import {Item} from "types/item"
import styles from "styles/top.module.css";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import Pagination from "components/Paging";
import SearchForm from "components/SearchForm";
import SortSelect from "components/SortSelect";

// 1ページあたりの最大表示件数を指定
const PAGE_SIZE = 2;

type Props = {items: Array<Item>, keyword: string, genre: string, page: number, totalCount: number}

export default function SearchIndex ({items, keyword, genre, page, totalCount}: Props) {
    const router = useRouter();
    const onClick = (index: number) => {
        router.push({
            pathname: '/searchResult',
            query: { keyword: keyword, genre: genre, page: index },
        });
    }
    const onSortChange = (value: string)=>{
        router.push({
            pathname: '/searchResult',
            query: { keyword: keyword, genre: genre, sort: value },
        });
    }
    return (
        <>
        <Head>
            <title>検索結果</title>
        </Head>
        <SearchForm />
        <div>検索結果：{totalCount}件</div>
        <SortSelect onSortChange={onSortChange} />
        {totalCount === 0 ? (
            <>
            <div>条件に合う検索結果がありません。</div>
            </>
        ): (
            <section className={styles.itemList}>
                {items.map((item)=>{
                    return(
                        <div key={item.id} className={styles.item}>
                        <Link href={`/${item.id}`}>
                        <Image src={item.itemImage} width={200} height={112.5} alt={item.artist} />
                        <br />
                        <div>{item.artist}</div>
                        <div>{item.fesName}</div>
                        {/* <div>{item.releaseDate}</div> */}
                        </Link>
                        </div>
                    )
                })}
            </section>
        )}
        <Pagination
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            currentPage={page}
            onClick={onClick}
        />
        </>
    )
}


export async function getServerSideProps ({query}: GetServerSidePropsContext) {
    const keyword = query.keyword as string;
    const genre = query.genre as string;
    const page = query.page ? + query.page : 1
    const sort = query.sort? query.sort : 'new';
    const res = await fetch(`http://localhost:3000/api/items`)
    const items = await res.json()
    const result = items.filter((item: Item)=>{
        if (!keyword) {
            for(let category of item.categories){
                if(category === parseInt(genre)){
                    return item
                }
            }
        }
        else if (!genre) {
            if(item.artist.indexOf(keyword) > -1 ){
                return item
            } else if(item.fesName.indexOf(keyword) > -1 ){
                return item
            } else {
                for(let word of item.keywords){
                    if(word.indexOf(keyword) > -1){
                        return item
                    }
            }
            }
        } else if (genre && keyword) {
                for(let word of item.keywords){
                    for(let category of item.categories){
                    if(category === parseInt(genre) && item.artist.indexOf(keyword) > -1){
                        return item
                        } else if(category === parseInt(genre) && word.indexOf(keyword) > -1){
                            return item
                        } else if(category === parseInt(genre) &&  item.fesName.indexOf(keyword) > -1){
                            return item
                        }
                    }
                }
            }
    }).reverse();
    const ordered = result.sort((a: Item, b: Item)=>{if(sort === 'new'){
                                                        if(b.id - a.id) {return -1}
                                                        if(a.id - b.id) {return 1}
                                                        {return 0}}
                                                    else if(sort === 'higher'){
                                                        if(a.twoDaysPrice - b.twoDaysPrice) {return -1}
                                                        if(b.twoDaysPrice - a.twoDaysPrice) {return 1}
                                                        {return 0}}
                                                    else if(sort === 'lower'){
                                                        if(b.twoDaysPrice - a.twoDaysPrice){return -1}
                                                        if(a.twoDaysPrice - b.twoDaysPrice) {return 1}
                                                        {return 0}}
                                                    })
    const count = ordered.length;
    const startIndex = (page - 1) * PAGE_SIZE;
    const paging = ordered.slice(startIndex, (startIndex + PAGE_SIZE));
    return {
        props: {
            items: paging,
            keyword: keyword,
            genre: genre,
            page: page,
            totalCount: count ? count : 0,
        }
    }
}
