import { NextApiRequest, NextApiResponse } from "next";
import { fetchMaterials } from "@/api/database/material";
import _ from "lodash";

// TODO: Improve this later
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    page,
    perPage,
    info,
    list,
  }: { page?: number; perPage?: number; list?: boolean; info?: boolean } = req.query;

  if (info) {
    return res.status(200).json({
      total: Object.values(await fetchMaterials()).length,
    });
  }

  if (page) {
    const materials = Object.values(await fetchMaterials());
    const elements = _.chunk(materials, perPage ?? 10)[page - 1];

    if (!elements) return res.status(400).json({ message: "Page out of bounds." });
    return res.status(200).json({ elements, total: materials.length });
  }

  if (list) return res.status(200).json(await fetchMaterials());
  return res.status(200).json(await fetchMaterials());
}
