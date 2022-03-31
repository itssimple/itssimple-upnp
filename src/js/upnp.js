function UPnPClient() {
  let upnp = require("nat-upnp");

  this.client = upnp.createClient();

  this.portMapping = async function (options) {
    return new Promise((resolve, reject) => {
      this.client.portMapping(
        {
          public: options.public,
          private: options.private,
          ttl: options.ttl,
          description: options.description,
        },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  };

  this.portUnmapping = async function (options) {
    return new Promise((resolve, reject) => {
      this.client.portUnmapping(
        {
          public: options.public,
        },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  };

  this.getMappings = async function () {
    return new Promise((resolve, reject) => {
      this.client.getMappings((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

  this.getMappings = async function (options) {
    return new Promise((resolve, reject) => {
      this.client.getMappings(options, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };

  this.checkIfUPnPIsAvailable = async function () {
    const testPort = 60006;
    let result = await this.getMappings();
    if (result.length > 0) {
      return true;
    } else {
      try {
        await this.portMapping({
          public: testPort,
          private: testPort,
          ttl: 5,
        });

        let maps = await this.getMappings({
          local: true,
        });

        if (maps.length > 0) {
          await this.portUnmapping({
            public: testPort,
          });
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    }
  };
  return this;
}

window.UPnPClient = new UPnPClient();
