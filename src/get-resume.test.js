import Assembler from "stream-json/Assembler";
import getResume from "./get-resume";

describe("get-resume", () => {
  it("should stream in the data of the resume from a file", async () => {
    await expect(getResume({ path: "test/resume.json" })).resolves
      .toMatchInlineSnapshot(`
      Object {
        "awards": Array [
          Object {
            "awarder": "Techcrunch",
            "date": "2014-11-01",
            "summary": "There is no spoon.",
            "title": "Digital Compression Pioneer Award",
          },
        ],
        "basics": Object {
          "email": "test4@test.com",
          "label": "Programmer",
          "location": Object {
            "address": "2712 Broadway St",
            "city": "San Francisco",
            "countryCode": "US",
            "postalCode": "CA 94115",
            "region": "California",
          },
          "name": "test",
          "phone": "(912) 555-4321",
          "picture": "",
          "profiles": Array [
            Object {
              "network": "Twitter",
              "url": "",
              "username": "neutralthoughts",
            },
            Object {
              "network": "SoundCloud",
              "url": "https://soundcloud.com/dandymusicnl",
              "username": "dandymusicnl",
            },
          ],
          "summary": "Richard hails from Tulsa. He has earned degrees from the University of Oklahoma and Stanford. (Go Sooners and Cardinals!) Before starting Pied Piper, he worked for Hooli as a part time software developer. While his work focuses on applied information theory, mostly optimizing lossless compression schema of both the length-limited and adaptive variants, his non-work interests range widely, everything from quantum computing to chaos theory. He could tell you about it, but THAT would NOT be a “length-limited” conversation!",
          "website": "http://richardhendricks.com",
        },
        "education": Array [
          Object {
            "area": "Information Technology",
            "courses": Array [
              "DB1101 - Basic SQL",
              "CS2011 - Java Introduction",
            ],
            "endDate": "2014-01-01",
            "gpa": "4.0",
            "institution": "University of Oklahoma",
            "startDate": "2011-06-01",
            "studyType": "Bachelor",
          },
        ],
        "interests": Array [
          Object {
            "keywords": Array [
              "Ferrets",
              "Unicorns",
            ],
            "name": "Wildlife",
          },
        ],
        "languages": Array [
          Object {
            "fluency": "Native speaker",
            "language": "English",
          },
        ],
        "publications": Array [
          Object {
            "name": "Video compression for 3d media",
            "publisher": "Hooli",
            "releaseDate": "2014-10-01",
            "summary": "Innovative middle-out compression algorithm that changes the way we store data.",
            "website": "http://en.wikipedia.org/wiki/Silicon_Valley_(TV_series)",
          },
        ],
        "references": Array [
          Object {
            "name": "Erlich Bachman",
            "reference": "It is my pleasure to recommend Richard, his performance working as a consultant for Main St. Company proved that he will be a valuable addition to any company.",
          },
        ],
        "skills": Array [
          Object {
            "keywords": Array [
              "HTML",
              "CSS",
              "Javascript",
            ],
            "level": "Master",
            "name": "Web Development",
          },
          Object {
            "keywords": Array [
              "Mpeg",
              "MP4",
              "GIF",
            ],
            "level": "Master",
            "name": "Compression",
          },
        ],
        "volunteer": Array [
          Object {
            "endDate": "2013-01-01",
            "highlights": Array [
              "Awarded 'Teacher of the Month'",
            ],
            "organization": "CoderDojo",
            "position": "Teacher",
            "startDate": "2012-01-01",
            "summary": "Global movement of free coding clubs for young people.",
            "website": "http://coderdojo.com/",
          },
        ],
        "work": Array [
          Object {
            "company": "Pied Piper",
            "endDate": "2014-12-01",
            "highlights": Array [
              "Build an algorithm for artist to detect if their music was violating copy right infringement laws",
              "Successfully won Techcrunch Disrupt",
              "Optimized an algorithm that holds the current world record for Weisman Scores",
            ],
            "position": "CEO/President",
            "startDate": "2013-12-01",
            "summary": "Pied Piper is a multi-platform technology based on a proprietary universal compression algorithm that has consistently fielded high Weisman Scores™ that are not merely competitive, but approach the theoretical limit of lossless compression.",
            "website": "http://piedpiper.com",
          },
        ],
      }
    `);
  });
});
