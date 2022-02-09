import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useSearchParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [paramObj, setParamObj] = useState({});

  useEffect(() => {
    const obj = {
      _start: searchParams.has('_start')
        ? parseInt(searchParams.get('_start'))
        : 0,
      _sort: searchParams.has('_sort')
        ? searchParams.get('_sort')
        : 'created_at:DESC',
      grade: searchParams.has('grade') ? searchParams.get('grade') : null,
      learning_standard: searchParams.has('learning_standard')
        ? searchParams.get('learning_standard')
        : null,
      unit: searchParams.has('unit') ? searchParams.get('unit') : null,
      classroom: searchParams.has('classroom')
        ? searchParams.get('classroom')
        : null,
    };

    Object.keys(obj).forEach((key) => {
      if (obj[key] == null) delete obj[key];
    });
    setParamObj(obj);
    setSearchParams(obj);
  }, [searchParams]);

  const setSearchParam = ({
    _start,
    _sort,
    grade,
    learning_standard,
    unit,
    classroom,
  }) => {
    let obj = {};
    if (_start == null && _sort == null) {
      obj = {
        _start: 0,
        _sort: 'created_at:DESC',
        grade,
        learning_standard,
        unit,
        classroom,
      };
    } else {
      obj = paramObj;
      if (_start !== null) obj['_start'] = _start;
      if (_sort) obj['_sort'] = _sort;
      if (grade) obj['grade'] = grade;
      if (learning_standard) obj['learning_standard'] = learning_standard;
      if (unit) obj['unit'] = unit;
      if (classroom) obj['classroom'] = classroom;
    }
    Object.keys(obj).forEach((key) => {
      if (obj[key] == null) delete obj[key];
    });

    setParamObj(obj);
    setSearchParams(obj);
  };

  return { paramObj, setSearchParam };
}
