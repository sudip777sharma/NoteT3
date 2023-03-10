import { type Notes } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

import { trpc } from "../utils/api";

const Home: NextPage = () => {

  const [isScrolled, setIsScrolled] = useState(false);

  const [allNotes, setAllNotes] = useState<Notes[]>([]);

  const utils = trpc.useContext();
  const { data: AllNotes, isLoading, isError, error } = trpc.mynotes.allNotes.useQuery();
  console.log("AllNotes: ", AllNotes);

  const deleteNote = trpc.mynotes.deleteNote.useMutation({
    onSettled: async () => {
      await utils.mynotes.allNotes.invalidate();
    },
  });
  const handleDelete = (id: string) => {
    // console.log("delete id", id);
    deleteNote.mutate({
      id: id
    })
  }

  const [searchTitle, setSearchTitle] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name, id } = e.target;
    console.log("value: ", value);
    setSearchTitle(value);
    console.log("searchTitle: ", searchTitle);
  }

  const handleSearch = () => {
    console.log(searchTitle);
  }

  const updateNote = trpc.mynotes.updateNote.useMutation({
    onSuccess: async () => {
      await utils.mynotes.allNotes.invalidate();
    }
  })
  const handleDone = (id: string, title: string, description: string, isDone: boolean) => {
    console.log(searchTitle);
    updateNote.mutate({
      id,
      title,
      description,
      isDone: !isDone,
    })
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c] ">
        <div
          className={`sticky top-0 w-full flex justify-center mb-2 no-scrollbar z-50`}
        >
          <h1
            className="text-base font-bold text-white mt-7 h-7 align-center"
          >
            List of all notes
          </h1>
          <div
            className="flex m-4 bg-gray-500 align-middle rounded-lg w-80"
          >
            <input
              className="outline-none rounded-lg py-1 px-2 m-2 text-black"
              type="text"
              name="searchTitle"
              placeholder="search Note"
              required
              onChange={handleSearchChange}
              value={searchTitle}
            />
            <button
              className="bg-green-600 h-8 text-white rounded-lg mt-2 mr-2 px-2 shadow-sm ring-1 ring-green-600 hover:bg-green-700 hover:ring-green-700"
              onClick={handleSearch}
            >search note</button>
          </div>
        </div>
        <Link
          className="inline-block rounded-lg bg-green-600 mb-1 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-green-600 hover:bg-green-700 hover:ring-green-700 fixed drop-shadow-2xl bottom-7 right-12 z-10"
          href="/newnote"
        >
          add a note
        </Link>
        <div
          className="snap-both max-h-full px-20 py-5 overflow-y-auto border-zinc-900 grid gap-4 grid-cols-1 md:grid-cols-3 "
        >
          {
            AllNotes?.filter(item => item.title.toLowerCase().includes(searchTitle.toLowerCase()))?.map((note, indx) => {
              return (
                <div className={`bg-zinc-900 m-2 px-4 py-9 rounded-lg w-50 has-tooltip ${note.isDone ? "opacity-50" : 'opacity-100'} relative`} key={indx}>
                  <div className="bg-[#44403c] rounded-lg tooltip bottom-20 max-w-xs flex flex-col gap-3 p-3 text-white">
                    <span className="">{note.title}</span>
                    <span className="">{note.description}</span>
                  </div>
                  <h1
                    className="text-white"
                  >
                    {note.title}
                  </h1>
                  <span className="flex items-center justify-between w-full">
                    <p
                      className="opacity-50 text-white max-w-xs truncate"
                    >{note.description}
                    </p>
                    <button
                      className="text-blue-700 font-bold"
                    >
                      view
                    </button>
                  </span>
                  <Link
                    className="text-white rounded-lg bg-blue-600 p-1 m-1 shadow-sm ring-1 ring-blue-600 hover:bg-blue-700 hover:ring-blue-700"
                    href={`/edit/${note.id}`}
                  >edit</Link>
                  <button
                    className="text-white rounded-lg bg-red-600 p-1 m-1 shadow-sm ring-1 ring-red-600 hover:bg-red-700 hover:ring-red-700"
                    onClick={() => handleDelete(note.id)}
                  >delete</button>
                  <button
                    className="text-white rounded-lg bg-green-600 p-1 m-1 shadow-sm ring-1 ring-green-600 hover:bg-green-700 hover:ring-green-700"
                    onClick={() => handleDone(note.id, note.title, note.description, note.isDone)}
                  >
                    Done
                  </button>
                </div>
              )
            })
          }
        </div>
      </main>
    </>
  );
};

export default Home;
