
// Written by Andriy Kusyi
// Reviewer : 
describe('Filter : partOfSpeechFilter', function () {
    var partOfSpeechFilter;
    beforeEach(module('MyApp'));
    beforeEach(inject(function(_partOfSpeechFilter_){
        partOfSpeechFilter = _partOfSpeechFilter_;
    }
    ));
    beforeEach(
        firstWord = {
            Name: 'Fu*k',
            PartOfSpeech : 1
        },
        secondWord = {
            Name: 'this',
            PartOfSpeech : 2
        },
        thirdWord = {
            Name: 'filter',
            PartOfSpeech: 3
        },
        fourthWord = {
            Name: '!!!',
            PartOfSpeech: null
        }
    )
        it('should return words only without partsOfSpeech',function(){
            var selectedPartsOfSpeech = [
                {
                    Name : "without"
                }
            ];
            expect(partOfSpeechFilter(fourthWord, selectedPartsOfSpeech)).toBe(fourthWord);
            expect(partOfSpeechFilter(firstWord, selectedPartsOfSpeech)).toBeUndefined();
            expect(partOfSpeechFilter(secondWord, selectedPartsOfSpeech)).toBeUndefined();
            expect(partOfSpeechFilter(thirdWord, selectedPartsOfSpeech)).toBeUndefined();
        });

        it('should return selected parts of speech', function () {
            var selectedPartsOfSpeech = [
                {
                    Name: "noun",
                    id: 1
                }, {
                    Name: "verb",
                    id: 2
                }
            ];
            expect(partOfSpeechFilter(firstWord, selectedPartsOfSpeech)).toBe(firstWord);
            expect(partOfSpeechFilter(secondWord, selectedPartsOfSpeech)).toBe(SecondWord);
            expect(partOfSpeechFilter(thirdWord, selectedPartsOfSpeech)).toBeUndefined();
            expect(partOfSpeechFilter(fourthWord, selectedPartsOfSpeech)).toBeUndefined();
        });

        it('should return selected parts of speech and without', function () {
            var selectedPartsOfSpeech = [
                {
                    Name: "without",
                }, {
                    Name: "verb",
                    id: 2
                }
            ];
            expect(partOfSpeechFilter(firstWord, selectedPartsOfSpeech)).toBeUndefined();
            expect(partOfSpeechFilter(secondWord, selectedPartsOfSpeech)).toBe(SecondWord);
            expect(partOfSpeechFilter(thirdWord, selectedPartsOfSpeech)).toBeUndefined();
            expect(partOfSpeechFilter(fourthWord, selectedPartsOfSpeech)).toBe(fourthWord);
        });

    });