class Sphere extends RenderObject {
    constructor(glContext, object) {
      super(glContext, object);
      this.type = "sphere";
      this.model = {
        ...this.model,
        vertices: [],
        normals: [],
        triangles: [],
        uvs: []
      };
  
      this.generate(
        object.horizSegments ? object.horizSegments : 16,
        object.vertSegments ? object.vertSegments : 16,
        object.radius ? object.radius : 2
      );
    }
  
    generate(horizSegments, vertSegments, radius) {
      const sectorCount = vertSegments;
      const stackCount = horizSegments;
  
      let x = 0, y = 0, z = 0, xy = 0;
      let lengthInv = (1.0 / radius);
      let nx = (1.0 / radius), ny = (1.0 / radius), nz = (1.0 / radius);
      let k1 = 0, k2 = 0;
      let sectorStep = (2 * Math.PI) / sectorCount;
      let stackStep = Math.PI / stackCount;
      let sectorAngle = 0.0, stackAngle = 0.0;
  
      for (let i = 0; i < stackCount + 1; i++) {
        stackAngle = (Math.PI / 2) - (i * stackStep);
        xy = radius * Math.cos(stackAngle);
        z = radius * Math.sin(stackAngle);
        k1 = i * (sectorCount + 1);
        k2 = k1 + sectorCount + 1;
  
        for (let j = 0; j < sectorCount + 1; j++) {
          sectorAngle = j * sectorStep;
          x = xy * Math.cos(sectorAngle);
          y = xy * Math.sin(sectorAngle);
          this.model.vertices = [...this.model.vertices, ...[x, y, z]];
  
          nx = x * lengthInv;
          ny = y * lengthInv;
          nz = z * lengthInv;
  
          this.model.normals = [...this.model.normals, ...[nx, ny, nz]];
  
          let s = j / sectorCount;
          let t = i / stackCount;
          this.model.uvs = [...this.model.uvs, ...[s, t]];
  
          if (i !== 0) {
            this.model.triangles = [...this.model.triangles, ...[k1, k2, k1 + 1]];
          }
  
          if (i != (stackCount - 1)) {
            this.model.triangles = [...this.model.triangles, ...[k1 + 1, k2, k2 + 1]]
          }
  
          k1++;
          k2++;
        }
      }
    }
  
    async setup() {
        this.centroid = calculateCentroid(this.model.vertices);
        this.lightingShader();
        this.scale(this.initialTransform.scale);
        this.translate(this.initialTransform.position);
        this.model.rotation = this.initialTransform.rotation;
        this.initBuffers();
    }
  }