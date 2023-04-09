import nc from "next-connect";
import middleware from "../../../middleware/all";
import onError from "../../../middleware/error";
import { doc } from '../../../db'
import { Request } from "../../../types";
import { NextApiResponse } from "next";

const handler = nc<Request, NextApiResponse>({
  onError
})

handler.use(middleware)

handler.put(async (req, res) => {
  const updatedDoc = await doc.updateOne(req.db, req.query.id as string, req.body)

  res.send({ data: updatedDoc })
})

export default handler