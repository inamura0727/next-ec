import Head from "next/head";
import useSWR, { mutate } from 'swr';
import Header from "components/Header";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "styles/chatbot.module.css";
import { Item } from "types/item";
import Image from "next/image";
import Router from "next/router";
import React from "react";
import { config } from '../config/index';
import { User } from "types/user";
import { SessionUser } from "pages/api/getUser";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type ChatList = { id: number, text?: string, choices?:Array<Choice>, continue: boolean, option: string,}
type Choice = {id: number, text: string}

export default function Chatbot({chatList, data}: {chatList: Array<ChatList>, data: SessionUser}) {
    
    const [count, setCount] = useState(1);
    const [output, setOutput] = useState([chatList[0]]);
    const [option, setOption] = useState(0);
    const [method, setMethod] = useState(0);
    const [genre, setGenre] = useState(0);
    const [feeling, setFeeling] = useState(0);
    const [who, setWho] = useState(0)
    const [optionButton, setOptionButton] = useState(true);
    const [selectMethodButton, setSelectMethodButton] = useState(true);
    const [button, setButton] = useState(true);
    const [selectFeelingButton, setSelectFeelingButton] = useState(true);
    const [selectWhoButton, setSelectWhoButton] = useState(true);
    const [getItems, setItems] = useState([])

    const chatArea = useRef<HTMLDivElement>(null);

    const items: Array<Item> = getItems;

    useEffect(()=>{
        // itemsを取得
        fetch(`${config.items}?categories_like=${genre}`)
        .then(res => res.json())
        .then(data => {
            setItems(data)
        })
    }, [genre])

    useEffect(() =>{
            if(count === chatList.length){
                return
            }
            // 1回目の質問まで
            if(count < 4){
                const id = setTimeout(() => {
                    setCount((prev) => prev + 1);
                    setOutput((prev) => [...prev, chatList[count]])
                }, 2000);
                return () => clearTimeout(id)
            }
            // 1回目の質問解答後、1回だけ回す
            if(count < 5){
                if(!optionButton){
                    if(option === 1){
                        const id = setTimeout(() => {
                            setCount((prev) => prev + 1);
                            setOutput((prev) => [...prev, chatList[count]])
                        }, 1000);
                        return () => clearTimeout(id)
                    }
                    if(option === 2){
                        const id = setTimeout(() => {
                            setCount((prev) => prev + 3);
                            setOutput((prev) => [...prev, chatList[count + 2]])
                        }, 1000);
                        return () => clearTimeout(id)
                    }
                }
            }
            // 「今のおすすめ」ルートを1回だけ回してsetGenre()
            if(count < 6){
                if(option === 1){
                    if(count >= 5){
                        if(option === 1){
                            // 仮でJ-POPをおすすめ
                            setGenre(1) 
                            const id = setTimeout(() => {
                                setCount((prev) => prev + 1);
                                setOutput((prev) => [...prev, chatList[count]]);
                            }, 2000);
                            return () => clearTimeout(id)
                        }
                    }
                }
            }
            // 「今のおすすめルート」終了
            if(count < 7){
                if(option === 1){
                    if(count >= 6){
                        if(option === 1){
                            const id = setTimeout(() => {
                                setCount((prev) => prev + 1);
                                setOutput((prev) => [...prev, chatList[chatList.length -1]]);
                            }, 2000);
                            return () => clearTimeout(id)
                        }
                    }
                }
            }
            // 「自分に合った作品」ルート1回だけ回して質問提示
            if(count < 8){
                if(option === 2){
                    if(count >= 7){
                            const id = setTimeout(() => {
                                setCount((prev) => prev + 1);
                                setOutput((prev) => [...prev, chatList[count]]);
                            }, 2000);
                            return () => clearTimeout(id)
                    }
                }
            }
            // 質問回答後、1回だけ回す
            if(count < 10){
                if(option === 2){
                    if(!selectMethodButton){
                        if(method === 1){
                            const id = setTimeout(() => {
                                setCount((prev) => prev + 1);
                                setOutput((prev) => [...prev, chatList[count]])
                            }, 1000);
                            return () => clearTimeout(id)
                        }
                        if(method === 2){
                            const id = setTimeout(() => {
                                setCount((prev) => prev + 8);
                                setOutput((prev) => [...prev, chatList[count + 7]])
                            }, 1000);
                            return () => clearTimeout(id)
                        }
                }
                }
            }
            // 「興味のあるジャンルルート」終了
            if(count < 15){
                if(option === 2){
                    if(method === 1){
                            if(!button){
                                const id = setTimeout(() => {
                                    setCount((prev) => prev + 1);
                                    setOutput((prev) => [...prev, chatList[count]])
                                }, 2000);
                                return () => clearTimeout(id)
                                } else {
                                    return
                                }
                    }
                    }
            }
            // 「今の気分」ルート1回回して1つめの質問提示
            if(count < 17){
                if(option === 2){
                    if(method === 2){
                        if(count >= 16){
                            const id = setTimeout(() => {
                                setCount((prev) => prev + 1);
                                setOutput((prev) => [...prev, chatList[count]]);
                            }, 2000);
                            return () => clearTimeout(id)
                    }
                    }
                }
            }
            // 「今の気分」ルート2回回して2つめの質問提示
            if(count < 19){
                if(option === 2){
                    if(method === 2){
                        if(!selectFeelingButton){
                            const id = setTimeout(() => {
                                setCount((prev) => prev + 1);
                                setOutput((prev) => [...prev, chatList[count]]);
                            }, 2000);
                            return () => clearTimeout(id)
                    }
                    }
                }
            }
             // 質問回答後、回答に一致するcategoriesIdを取得
             if(count < 20){
                if(option === 2){
                    if(method === 2){
                        if(!selectWhoButton){
                            fetch(`${config.answers}?q1=${feeling}&q2=${who}`)
                            .then(res => res.json())
                            .then(data => {
                                setGenre(data[0].categoriesId)
                            })
                            const id = setTimeout(() => {
                                setCount((prev) => prev + 1);
                                setOutput((prev) => [...prev, chatList[count]]);
                            }, 2000);
                            return () => clearTimeout(id)
                    }
                    }
                }
             }
             // 「今の気分ルート終了」
             if(option === 2){
                if(method === 2){
                    if(count >= 20){
                        const id = setTimeout(() => {
                            setCount((prev) => prev + 1);
                            setOutput((prev) => [...prev, chatList[count]]);
                        }, 2000);
                        return () => clearTimeout(id)
                }
                }
            }
    }, [optionButton, count, option, selectMethodButton, method, button, selectFeelingButton, selectWhoButton, feeling, who, chatList])

    useEffect(() => {
        chatArea?.current?.scrollIntoView(
            {
                behavior: "smooth",
                block: "end",
                inline: "nearest"
            }
        );
    });

    const select = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setOptionButton(false);
    }

    const selectMethod = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setSelectMethodButton(false);
    }

    const selectFeeling = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setSelectFeelingButton(false);
    }

    const selectWho = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setSelectWhoButton(false);
    }

    const submit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setButton(false);
        const info = { favoriteGenre: genre }
        await fetch(`${config.users}/${data.userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(info)
        })
            .then((res) => res.json())
    }

    const route = () => {
        Router.push('/')
    }

    return (
        <>
            <Head>
                <title>
                    チャットボット
                </title>
            </Head>
            <Header isLoggedIn={data?.isLoggedIn} dologout={() => mutate('/api/getUser')} />
            <div className={styles.chatbotPage} key='chatbotPage'>
            <div className={styles.chatbotWrapper} key='chatbotWrapper'>
            <div id="chatbot-body" className={styles.chatbotBody} key='chatboy-body'>
                <div className={styles.header} key='header'>
                <div className={styles.title} key='chath1'>チャットボット</div>
                </div>
                <div id="chatbot" className={styles.chatArea} key='chatArea'>
                    {output.map((obj) => {
                        if (obj.choices) {
                            if(obj.id === 4)
                            return (
                                <div key={`question${obj.id}`} ref={chatArea}>
                                    {optionButton ? (
                                        <div className={styles.choice} key={`choice${obj.id}`}>
                                        <div key={`cl${obj.id}`} className={styles.choiceTitle}>{obj.text}</div>
                                        <form method="get" id="form" onSubmit={select} className={styles.form} key='form'>
                                        {obj.choices.map((choice)=>{
                                        return (
                                        <div key={choice.id}>
                                        <input name="favoriteGenre" key={choice.id} type="radio" value={choice.id} onChange={(e) => setOption(Number(e.target.value))} />
                                        <label key={`label${choice.id}`} htmlFor={choice.id.toString()} >{choice.text}</label>
                                        </div>
                                        )
                                        })}
                                        <button className={styles.submitBtn} key={'button'} type="submit">決定</button>
                                        </form>
                                        </div>
                                            ) : (
                                                    <div key={`ans${obj.id}`} className={styles.answer} ref={chatArea}>
                                                        <div key={`cl${obj.id}`} className={styles.rightChat}>
                                                            {obj.choices[option - 1].text}
                                                        </div>
                                                    </div>
                                                )
                                        }
                                </div>
                            )
                            if(obj.id === 8)
                            return (
                                <div key={`question${obj.id}`} ref={chatArea}>
                                    {selectMethodButton ? (
                                        <div className={styles.choice} key={`choice${obj.id}`}>
                                        <div key={`cl${obj.id}`} className={styles.choiceTitle}>{obj.text}</div>
                                        <form method="get" id="form" onSubmit={selectMethod} className={styles.form} key='form'>
                                        {obj.choices.map((choice)=>{
                                        return (
                                        <div key={choice.id}>
                                        <input name="favoriteGenre" key={choice.id} type="radio" value={choice.id} onChange={(e) => setMethod(Number(e.target.value))} />
                                        <label key={`label${choice.id}`} htmlFor={choice.id.toString()} >{choice.text}</label>
                                        </div>
                                        )
                                        })}
                                        <button className={styles.submitBtn} key={'button'} type="submit">決定</button>
                                        </form>
                                        </div>
                                            ) : (
                                                    <div key={`ans${obj.id}`} className={styles.answer}>
                                                        <div key={`cl${obj.id}`} className={styles.rightChat}>
                                                            {obj.choices[method - 1].text}
                                                        </div>
                                                    </div>
                                                )
                                        }
                                </div>
                            )
                            if(obj.id === 10)
                            return (
                                <div key={`question${obj.id}`} ref={chatArea}>
                                    {button ? (
                                        <div className={styles.choice} key='choice'>
                                        <div key={`cl${obj.id}`} className={styles.choiceTitle}>{obj.text}</div>
                                        <form method="get" id="form" onSubmit={submit} className={styles.form} key='form'>
                                        {obj.choices.map((choice)=>{
                                        return (
                                        <div key={choice.id}>
                                        <input name="favoriteGenre" key={choice.id} type="radio" value={choice.id} onChange={(e) => setGenre(Number(e.target.value))} />
                                        <label key={`label${choice.id}`} htmlFor={choice.id.toString()} >{choice.text}</label>
                                        </div>
                                        )
                                    })}
                                        <button className={styles.submitBtn} key={'button'} type="submit">決定</button>
                                        </form>
                                        </div>
                                            ) : (
                                                <div key={`ans${obj.id}`} className={styles.answer}>
                                                    <div key={`cl${obj.id}`} className={styles.rightChat}>
                                                        {obj.choices[genre - 1].text}
                                                    </div>
                                                </div>
                                                )
                                        }
                                </div>
                            )
                            if(obj.id === 18)
                            return (
                                <div key={`question${obj.id}`} ref={chatArea}>
                                    {selectFeelingButton ? (
                                        <div className={styles.choice} key='choice'>
                                        <div key={`cl${obj.id}`} className={styles.choiceTitle}>{obj.text}</div>
                                        <form method="get" id="form" onSubmit={selectFeeling} className={styles.form} key='form'>
                                        {obj.choices.map((choice)=>{
                                        return (
                                        <div key={choice.id}>
                                        <input name="favoriteGenre" key={choice.id} type="radio" value={choice.id} onChange={(e) => setFeeling(Number(e.target.value))} />
                                        <label key={`label${choice.id}`} htmlFor={choice.id.toString()} >{choice.text}</label>
                                        </div>
                                        )
                                    })}
                                        <button className={styles.submitBtn} key={'button'} type="submit">決定</button>
                                        </form>
                                        </div>
                                            ) : (
                                                <div key={`ans${obj.id}`} className={styles.answer}>
                                                    <div key={`cl${obj.id}`} className={styles.rightChat}>
                                                        {obj.choices[feeling - 1].text}
                                                    </div>
                                                </div>
                                                )
                                        }
                                </div>
                            )
                            if(obj.id === 20)
                            return (
                                <div key='question' ref={chatArea}>
                                    {selectWhoButton ? (
                                        <div className={styles.choice} key='choice'>
                                        <div key={`cl${obj.id}`} className={styles.choiceTitle}>{obj.text}</div>
                                        <form method="get" id="form" onSubmit={selectWho} className={styles.form} key='form'>
                                        {obj.choices.map((choice)=>{
                                        return (
                                        <div key={choice.id}>
                                        <input name="favoriteGenre" key={choice.id} type="radio" value={choice.id} onChange={(e) => setWho(Number(e.target.value))} />
                                        <label key={`label${choice.id}`} htmlFor={choice.id.toString()} >{choice.text}</label>
                                        </div>
                                        )
                                    })}
                                        <button className={styles.submitBtn} key={'button'} type="submit">決定</button>
                                        </form>
                                        </div>
                                            ) : (
                                                <div key={`ans${obj.id}`} className={styles.answer}>
                                                    <div key={`cl${obj.id}`} className={styles.rightChat}>
                                                        {obj.choices[who - 1].text}
                                                    </div>
                                                </div>
                                                )
                                        }
                                </div>
                            )
                        } else if(obj.option === 'recommend') {
                            return (
                                <section className={styles.itemList} ref={chatArea} key='recommend'>
                                {items.filter((item)=>{if(item.categories.includes(Number(genre))) return item})
                                .reverse()
                                .slice(0, 4)
                                .map((item)=>{
                                    return(
                                        <Link key={`itemLink${item.id}`} href={`/items/${item.id}`} className={styles.item}>
                                        <Image key={`itemImage${item.id}`} src={item.itemImage} width={400} height={225} alt={item.artist} className={styles.itemImage}/>
                                        <div key={`${item.artist}`} className={styles.artist}>{item.artist}</div>
                                        <div key={`${item.fesName}`} className={styles.fesName}>{item.fesName}</div>
                                        </Link>
                                    )
                                })}
                                </section>
                            )
                        } else if(obj.option === 'return'){
                            return (
                                <div key='returnButton' className={styles.returnBtnWrapper} ref={chatArea}>
                                    <button className={styles.returnBtn} key={obj.id} onClick={route}>{obj.text}</button>
                                </div>
                            )
                        } else {
                            if (obj.text)
                            return (
                                <div key={`bot${obj.id}`} className={styles.bot} ref={chatArea}>
                                <Image key={`icon${obj.id}`} className={styles.icon} src={"/images/chatIcon.jpeg"} width={30} height={30} alt={"アイコン"} />
                                <div className={styles.botSays} key={`cl${obj.id}`}>{obj.text.replace('Name', `${data.userName}`)}</div>
                                </div>
                            )
                        }
                    })}
                </div>
            </div>
                <div key='closeChatbot' className={styles.closeChatbot} onClick={() => route()}>
                        ×
                </div>
            </div>
            </div>
        </>
    )
}
