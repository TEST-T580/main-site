import Head from "next/head";
import { Layout } from "../../components/profile/layout";
import { ProfileInfo } from "../../components/profile/profileInfo";
import { DataInfo } from "../../components/profile/dataInfo";
import style from "../../styles/Profile.module.css";
import { LayoutPage } from "../../types";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { getClient } from "../../lib/sanity.server";
import { groq } from "next-sanity";

const Home: LayoutPage<{ data: any, preview: boolean }> = ({ data, preview }) => {
  const router = useRouter()

  if (!router.isFallback && !data) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Head>
        <title>Profil</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={style.gridContainer}>
        <ProfileInfo />
        <DataInfo data={data} />
      </div>
    </>
  );
};

export async function getStaticProps({ preview = false }) {
  const data = await getClient(preview).fetch(fetchProfilePage)

  return {
    props: {
      preview,
      data,
    },
  }
}

const fetchProfilePage = groq`
*[_type == "profile"] {
  tax,
  data
}
`

Home.layout = Layout;
export default Home;
