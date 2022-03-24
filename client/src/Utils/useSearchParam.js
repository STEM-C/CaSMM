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
      pageSize: searchParams.has('pageSize')
        ? parseInt(searchParams.get('pageSize'))
        : 10,
      grade: searchParams.has('grade') ? searchParams.get('grade') : null,
      learning_standard: searchParams.has('learning_standard')
        ? searchParams.get('learning_standard')
        : null,
      unit: searchParams.has('unit') ? searchParams.get('unit') : null,
      classroom: searchParams.has('classroom')
        ? searchParams.get('classroom')
        : null,
      students_in: searchParams.has('students_in')
        ? searchParams.get('students_in')
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
    pageSize,
    grade,
    learning_standard,
    unit,
    classroom,
    student,
  }) => {
    let obj = {};
    // if only the filter changes
    if (_start == null && _sort == null && pageSize == null) {
      obj = {
        _start: 0,
        _sort: 'created_at:DESC',
        pageSize: 10,
        grade,
        learning_standard,
        unit,
        classroom,
        students_in: student,
      };
    } else {
      console.log(pageSize);
      obj = paramObj;
      if (_start !== null) obj['_start'] = _start;
      if (_sort) obj['_sort'] = _sort;
      if (pageSize !== null) obj['pageSize'] = pageSize;
      if (grade) obj['grade'] = grade;
      if (learning_standard) obj['learning_standard'] = learning_standard;
      if (unit) obj['unit'] = unit;
      if (classroom) obj['classroom'] = classroom;
      if (student) obj['students_in'] = student;
    }
    Object.keys(obj).forEach((key) => {
      if (obj[key] == null) delete obj[key];
    });

    setParamObj(obj);
    setSearchParams(obj);
  };

  return { paramObj, setSearchParam };
}
