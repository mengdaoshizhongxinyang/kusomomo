import type { NextPage } from 'next'
import Head from 'next/head'
import { Kusomomo } from "kusomomo";
const Home: NextPage<Props> = ({posts}) => {
  return (
    <div>
      <Head>
        <title>schema</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  )
}
export async function getStaticProps() {
  const momo=new Kusomomo()
  momo.addConnection({
    driver:"sqlite3",
    connection:{
      database:"./test.db"
    }
  })
  Kusomomo.schema().create("test",(blueprint)=>{
    blueprint.increments("id")

  })
  return {
    props: {
      posts:{}
    },
  }
}
type Props=Awaited<ReturnType<typeof getStaticProps>>['props']
export default Home