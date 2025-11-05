// src/services/location.service.ts

import axios from 'axios'
import type { Province, Regency } from '@/interfaces/plan.interface'

const PROVINCE_API = 'https://wilayah.id/api/provinces.json'
const REGENCY_API = 'https://wilayah.id/api/regencies'

export class LocationService {
  async getProvinces(): Promise<Province[]> {
    const res = await axios.get<{ data: Province[] }>(PROVINCE_API)
    return res.data.data
  }

  async getRegencies(provinceCode: string): Promise<Regency[]> {
    const res = await axios.get<{ data: Regency[] }>(
      `${REGENCY_API}/${provinceCode}.json`
    )
    return res.data.data
  }
}
