import { z } from "zod";
import { procedure, router } from "../trpc";
import PouchDB from "pouchdb";

const db = new PouchDB("MyDb");
// const remote = new PouchDB("http://127.0.0.1:4000/kittens");

// db.info().then(function(info) {
//   console.log(info);
// })

// remote.info().then(function (info) {
//   console.log("remote", info);
// });

// db.get("mittens").then(function (doc) {
//   console.log(doc);
// });

// remote.get('mittens').then(function(doc) {
// //   console.log(doc, 'what');
// });

// db.sync(remote, {
//   live: true
// }).on('change', function(change) {
//   console.log('updated', change);
// }).on('error', function(err) {
//   console.log(err)
// });

export default router({
  getAll: procedure.query(() => {
    return db.allDocs({ include_docs: true }).then(function (doc: any) {
      console.log(doc.rows);
      const data = doc.rows.map((item: any) => {
        return item.doc;
      });

      return data;
    });
  }),

  create: procedure
    .input(
      z.object({
        title: z.string().max(32),
        description: z.string().max(64),
      })
    )
    .mutation(({ input }) => {
      const doc = {
        _id: new Date(),
        title: input.title,
        description: input.description,
      };

      return db
        .put(doc)
        .then(function (response) {
          console.log(response);
          return db.get(response.id).then(function (doc: any) {
            console.log(doc);
            return doc;
          });
        })
        .catch(function (err) {
          console.log(err);
        });
    }),
  delete: procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ input }) => {
      return db
        .get(input.id)
        .then(function (doc) {
          return db.remove(doc._id, doc._rev);
        })
        .then(function (result) {
          console.log("deleted");
          // handle result
        })
        .catch(function (err) {
          console.log(err);
        });
    }),
});
