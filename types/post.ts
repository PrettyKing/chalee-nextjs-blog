// id        Int      @id @default(autoincrement())
// title     String   @db.VarChar(255)
// content   String   @db.Text
// summary   String?  @db.VarChar(500)
// slug      String   @unique @db.VarChar(255)
// published Boolean  @default(false)
// createdAt DateTime @default(now())
// updatedAt DateTime @updatedAt

export interface Post {
    id: number;
    title: string;
    content: string;
    summary?: string;
    slug: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}