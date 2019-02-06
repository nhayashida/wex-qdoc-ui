declare type UserSettings = {
  collectionId: string;
  bodyField: string;
  titleField: string;
  linkField: string;
};

declare namespace Explorer {
  type QueryInput = {
    text: string;
    page: number;
    count: number;
  };

  type QueryResult = {
    numFound: number;
    docs: Document[];
  };

  type Document = {
    id: string;
    fields: { [key: string]: string };
    score?: number;
  };

  type Collection = {
    id: string;
    name: string;
    fields: { id: string; label: string }[];
  };
}
