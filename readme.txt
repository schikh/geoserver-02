

Enable CORS
-----------
Add xml to "C:\Program Files (x86)\GeoServer 2.9.0\etc\webdefault.xml"

<filter>
    <filter-name>cross-origin</filter-name>
    <filter-class>org.eclipse.jetty.servlets.CrossOriginFilter</filter-class>
</filter>
<filter-mapping>
    <filter-name>cross-origin</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>

Copy jetty-servlets-9.2.13.v20150730.jar (from http://repo1.maven.org/maven2/org/eclipse/jetty/jetty-servlets/) 
into "C:\Program Files (x86)\GeoServer 2.9.0\lib"


Sample data
-----------
CREATE TABLE Districts ( 
DistrictId int NOT NULL PRIMARY KEY,
DistrictName nvarchar(255),
DistrictGeo geometry );
GO

delete [Katmai].[dbo].Districts;

INSERT INTO Districts (DistrictName, DistrictGeo, DistrictId)
VALUES ('A', geometry::STGeomFromText('POLYGON ((180000 120000, 210000 120000, 210000 150000, 180000 150000, 180000 120000))', 31370), 0);

INSERT INTO Districts (DistrictName, DistrictGeo, DistrictId)
VALUES ('B', geometry::STGeomFromText('POLYGON ((90000 110000, 150000 110000, 150000 150000, 90000 150000, 90000 110000))', 31370), 1);

INSERT INTO Districts (DistrictName, DistrictGeo, DistrictId)
VALUES ('C', geometry::STGeomFromText('POLYGON ((200000 220000, 200000 250000, 250000 250000, 250000 220000, 200000 220000))', 31370), 2);

INSERT INTO Districts (DistrictName, DistrictGeo, DistrictId)
VALUES ('F', geometry::STGeomFromText('LINESTRING (100000 180000, 200000 180000, 190000 180001, 190000 220000)', 31370), 10);

INSERT INTO Districts (DistrictName, DistrictGeo, DistrictId)
VALUES ('E', geometry::STGeomFromText('LINESTRING (190000 90000, 250000 150000, 190000 200000)', 31370), 11);

select *, DistrictGeo.STAsText() FROM [Katmai].[dbo].Districts;


DROP TABLE Assets;

CREATE TABLE Assets ( 
  Id      int PRIMARY KEY,
  Name    nvarchar(255),
  LayerId int,
  Geomety geometry
);

DELETE Assets;

INSERT INTO Assets (Id, Name, LayerId, Geomety) VALUES (01, 'A 01', 01, geometry::STGeomFromText('POLYGON ((150100 150000, 150200 150000, 150200 151000, 150100 151000, 150100 150000))', 31370));
INSERT INTO Assets (Id, Name, LayerId, Geomety) VALUES (02, 'A 02', 02, geometry::STGeomFromText('POLYGON ((150200 150000, 150300 150000, 150300 151000, 150200 151000, 150200 150000))', 31370));
INSERT INTO Assets (Id, Name, LayerId, Geomety) VALUES (03, 'A 03', 03, geometry::STGeomFromText('POLYGON ((150300 150000, 150400 150000, 150400 151000, 150300 151000, 150300 150000))', 31370));
INSERT INTO Assets (Id, Name, LayerId, Geomety) VALUES (04, 'A 04', 04, geometry::STGeomFromText('POLYGON ((150400 150000, 150500 150000, 150500 151000, 150400 151000, 150400 150000))', 31370));
INSERT INTO Assets (Id, Name, LayerId, Geomety) VALUES (05, 'A 05', 05, geometry::STGeomFromText('POLYGON ((150500 150000, 150600 150000, 150600 151000, 150500 151000, 150500 150000))', 31370));
INSERT INTO Assets (Id, Name, LayerId, Geomety) VALUES (06, 'A 06', 06, geometry::STGeomFromText('POLYGON ((150600 150000, 150700 150000, 150700 151000, 150600 151000, 150600 150000))', 31370));
INSERT INTO Assets (Id, Name, LayerId, Geomety) VALUES (07, 'A 07', 07, geometry::STGeomFromText('POLYGON ((150700 150000, 150800 150000, 150800 151000, 150700 151000, 150700 150000))', 31370));
INSERT INTO Assets (Id, Name, LayerId, Geomety) VALUES (08, 'A 08', 08, geometry::STGeomFromText('POLYGON ((150800 150000, 150900 150000, 150900 151000, 150800 151000, 150800 150000))', 31370));
INSERT INTO Assets (Id, Name, LayerId, Geomety) VALUES (09, 'A 09', 09, geometry::STGeomFromText('POLYGON ((150900 150000, 151000 150000, 151000 151000, 150900 151000, 150900 150000))', 31370));
INSERT INTO Assets (Id, Name, LayerId, Geomety) VALUES (10, 'A 10', 10, geometry::STGeomFromText('POLYGON ((151000 150000, 151100 150000, 151100 151000, 151000 151000, 151000 150000))', 31370));
INSERT INTO Assets (Id, Name, LayerId, Geomety) VALUES (11, 'A 11', 11, geometry::STGeomFromText('POLYGON ((151100 150000, 151200 150000, 151200 151000, 151100 151000, 151100 150000))', 31370));
INSERT INTO Assets (Id, Name, LayerId, Geomety) VALUES (12, 'A 12', 12, geometry::STGeomFromText('POLYGON ((151200 150000, 151300 150000, 151300 151000, 151200 151000, 151200 150000))', 31370));
INSERT INTO Assets (Id, Name, LayerId, Geomety) VALUES (13, 'A 13', 13, geometry::STGeomFromText('POLYGON ((151300 150000, 151400 150000, 151400 151000, 151300 151000, 151300 150000))', 31370));
INSERT INTO Assets (Id, Name, LayerId, Geomety) VALUES (14, 'A 14', 14, geometry::STGeomFromText('POLYGON ((151400 150000, 151500 150000, 151500 151000, 151400 151000, 151400 150000))', 31370));
INSERT INTO Assets (Id, Name, LayerId, Geomety) VALUES (15, 'A 15', 15, geometry::STGeomFromText('POLYGON ((151500 150000, 151600 150000, 151600 151000, 151500 151000, 151500 150000))', 31370));
INSERT INTO Assets (Id, Name, LayerId, Geomety) VALUES (16, 'A 16', 16, geometry::STGeomFromText('POLYGON ((151600 150000, 151700 150000, 151700 151000, 151600 151000, 151600 150000))', 31370));
INSERT INTO Assets (Id, Name, LayerId, Geomety) VALUES (17, 'A 17', 17, geometry::STGeomFromText('POLYGON ((151700 150000, 151800 150000, 151800 151000, 151700 151000, 151700 150000))', 31370));
INSERT INTO Assets (Id, Name, LayerId, Geomety) VALUES (18, 'A 18', 18, geometry::STGeomFromText('POLYGON ((151800 150000, 151900 150000, 151900 151000, 151800 151000, 151800 150000))', 31370));
INSERT INTO Assets (Id, Name, LayerId, Geomety) VALUES (19, 'A 19', 19, geometry::STGeomFromText('POLYGON ((151900 150000, 152000 150000, 152000 151000, 151900 151000, 151900 150000))', 31370));
INSERT INTO Assets (Id, Name, LayerId, Geomety) VALUES (20, 'A 20', 20, geometry::STGeomFromText('POLYGON ((152000 150000, 152100 150000, 152100 151000, 152000 151000, 152000 150000))', 31370));

SELECT * FROM Assets;






=======================================================

CREATE TABLE [dbo].[geometry_columns](
[f_table_catalog] [varchar](50) NULL,
[f_table_schema] [varchar](50) NULL,
[f_table_name] [varchar](100) NULL,
[f_geometry_column] [varchar](50) NULL,
[coord_dimension] [int] NULL,
[srid] [int] NULL,
[geometry_type] [varchar](50) NULL
)

f_table_catalog f_table_schema  f_table_name    f_geometry_column   coord_dimension srid    geometry_type
GISDB   dbo Accuracy    SP_GEOMETRY 1   28355   LineString
GISDB   dbo AssetAreas  SP_GEOMETRY 2   28355   Polygon

=======================================================




Bellin Nicolas (Ores) 15:05
http://gis.stackexchange.com/questions/19902/how-i-get-srid-from-geometry-field
Bellin Nicolas (Ores) 15:09
__https://www.simple-talk.com/sql/t-sql-programming/introduction-to-sql-server-spatial-data/
Bellin Nicolas (Ores) 15:28
petite vidéo qui a l'air bien faite - query spatiales de base (représenter une ligne, polygone, calculer aire, périmètre,...)
__https://www.youtube.com/watch?v=f0YJFp7BQyc


var layers = [
  new ol.layer.Tile({
    extent: [-13884991, 2870341, -7455066, 6338219],
    source: new ol.source.TileWMS(/** @type {olx.source.TileWMSOptions} */ ({
      url: 'http://demo.boundlessgeo.com/geoserver/wms',
      params: {'LAYERS': 'topp:states', 'TILED': true},
      serverType: 'geoserver'
    }))
  })
];


http://localhost:9000/geoserver/test01/wms?service=WMS&version=1.1.0&request=GetMap&layers=test01:Assets&styles=&bbox=140000.0,150000.0,142000.0,151000.0&width=768&height=384&srs=EPSG:31370&format=application/openlayers&CQL_FILTER=LayerId=5

