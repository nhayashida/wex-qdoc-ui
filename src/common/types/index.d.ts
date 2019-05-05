type QueryInput = {
  text: string;
  page: number;
  count: number;
};

type QueryResult = {
  numFound: number;
  docs: ResultDocument[];
};

type ResultDocument = {
  id: string;
  fields: { [key: string]: string };
  score?: number;
};

type Collection = {
  id: string;
  name: string;
  fields: { id: string; label: string }[];
};
