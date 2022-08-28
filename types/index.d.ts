interface NewCollection<Document> extends Collection<Document> {
  addDataList?: (
    docs: OptionalId<Document>[]
  ) => Promise<InsertManyResult<Document>>;
}
export {};
