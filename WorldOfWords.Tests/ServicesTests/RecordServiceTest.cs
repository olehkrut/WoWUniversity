using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Moq;
using NUnit.Framework;
using WorldOfWords.Infrastructure.Data.EF.Factory;
using WorldOfWords.Infrastructure.Data.EF.UnitOfWork;
using WorldOfWords.Infrastructure.Data.EF.Contracts;
using WorldOfWords.Domain.Services;
using WorldOfWords.Domain.Models;
using WorldOfWords.Domain.Services.Services;
using WorldOfWords.API.Models;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;

namespace WorldOfWords.Tests.ServicesTests
{
    [TestFixture]
    class RecordServiceTest
    {
        private Mock<IUnitOfWorkFactory> _factory;
        private Mock<IWorldOfWordsUow> _uow;
        private Mock<IRepository<Record>> _repo;
        private RecordService _service;
        private Mock<IRecordMapper> _mapper;

        [SetUp]
        public void Setup()
        {
            _factory = new Mock<IUnitOfWorkFactory>();
            _uow = new Mock<IWorldOfWordsUow>();
            _repo = new Mock<IRepository<Record>>();
            _mapper = new Mock<IRecordMapper>();

            _service = new RecordService(_factory.Object, _mapper.Object);

            _factory.Setup(f => f.GetUnitOfWork()).Returns(_uow.Object);
            _uow.Setup(u => u.RecordRepository).Returns(_repo.Object);
        }

        [Test]
        public async Task GetRecordByIdAsync_ReturnsRecord()
        {
            //Arrange
            int recordId = 1;
            Record expected = new Record
            {
                Id = 1
            };

            _repo.Setup(r => r.GetByIdAsync(It.IsAny<int>())).ReturnsAsync(expected);
            //Act
            var actual = await _service.GetRecordModelByIdAsync(recordId);

            //Assert
            _factory.Verify(f => f.GetUnitOfWork(), Times.Once());
            _repo.Verify(r => r.GetByIdAsync(recordId), Times.Once());
            Assert.AreEqual(actual, expected);
        }

        //[Test]
        //public async Task GetRecordModelByIdASync_ReturnsRecordModel()
        //{

        //}
    }
}
