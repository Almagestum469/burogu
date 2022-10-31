import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import dbConnect from '../lib/dbConnect'
import Blog from '../models/Blog'

export default function Home({ total, maxPage, currentPage }) {
    const router = useRouter()
    return (
        <>
            <Head>
                <title>Burogu</title>
                <meta name='description' content='A Blog' />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <div>{`${router.query.page?.length}`}</div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (contxet) => {
    await dbConnect()

    const [limit, page] = [10, 1]
    /* find all the data in our database */
    const total = await Blog.find().countDocuments()
    const maxPage = Math.ceil(total / limit)
    const currentPage = await Blog.find()
        .sort('-date')
        .skip(page * limit)
        .limit(limit)
        .exec()

    return { props: { total, maxPage, currentPage } }
}
