namespace WorldOfWords.Infrastructure.Data.EF.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class lll : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.WordProgresses", "NumOfMistakes", c => c.Int());
        }
        
        public override void Down()
        {
            DropColumn("dbo.WordProgresses", "NumOfMistakes");
        }
    }
}
