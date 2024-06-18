import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUbigeo } from "src/services/ubigeo";

interface Ubigeo {
  _id: string;
  id_ubigeo: string;
  ubigeo_reniec: string;
  ubigeo_inei: string;
  departamento_inei: string;
  departamento: string;
  provincia_inei: string;
  provincia: string;
  distrito: string;
  region: string;
  macroregion_inei: string;
  macroregion_minsa: string;
  iso_3166_2: string;
  fips: string;
  superficie: string;
  altitud: string;
  latitud: string;
  longitud: string;
  Frontera: string;
}

const useUbigeo = () => {
  const [ubigeos, setUbigeos] = useState<Ubigeo[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  const { isPending, error, data } = useQuery({
    queryKey: ["ubigeo"],
    queryFn: getUbigeo,
  });

  useEffect(() => {
    if (data) {
      const ubigeos = data.data;
      setUbigeos(ubigeos);
      setDepartments(getUniqueDepartments(ubigeos));
    }
  }, [data]);

  const getUniqueDepartments = (ubigeos: Ubigeo[]): string[] => {
    const uniqueDepartments = new Set(ubigeos.map(ubigeo => ubigeo.departamento));
    return Array.from(uniqueDepartments);
  };

  const getProvincesByDepartamento = (departamento: string) => {
    const filteredProvinces = ubigeos.filter(ubigeo => ubigeo.departamento === departamento);
    setProvinces(getUniqueProvinces(filteredProvinces));
    setDistricts([]); // Clear districts when the province changes
  };

  const getUniqueProvinces = (ubigeos: Ubigeo[]): string[] => {
    const uniqueProvinces = new Set(ubigeos.map(ubigeo => ubigeo.provincia));
    return Array.from(uniqueProvinces);
  };

  const getDistricts = (departamento: string, provincia: string) => {
    const filteredDistricts = ubigeos.filter(
      ubigeo => ubigeo.departamento === departamento && ubigeo.provincia === provincia
    );
    setDistricts(filteredDistricts.map(ubigeo => ubigeo.distrito));
  };

  return {
    isPending,
    error,
    departments,
    provinces,
    districts,
    getProvincesByDepartamento,
    getDistricts,
  };
};

export default useUbigeo;
