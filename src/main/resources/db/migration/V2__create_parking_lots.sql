CREATE TABLE parking_lots (
                              id BIGSERIAL PRIMARY KEY,

                              name VARCHAR(255) NOT NULL,

                              address VARCHAR(500),

                              total_floors INT NOT NULL
);