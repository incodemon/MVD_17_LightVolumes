#version 330
//these outs correspond to the three color buffers
layout (location = 0) out vec3 g_position;
layout (location = 1) out vec3 g_normal;
layout (location = 2) out vec4 g_albedo;
//data from vertex shader
in vec2 v_uv;
in vec3 v_normal;
in vec3 v_vertex_world_pos;
//we need to upload these uniforms from material
uniform int u_use_diffuse_map;
uniform sampler2D u_diffuse_map;
uniform vec3 u_diffuse;
uniform vec3 u_specular;

void main() {
    //store the vertex world position
    g_position = v_vertex_world_pos;
    //store the vertex normal
    g_normal = normalize(v_normal);
    //compress specular to one number
    float specular = (u_specular.x + u_specular.y + u_specular.z) / 3;
    //store the albedo color and specular
    vec3 diffuse_color = u_diffuse;
   	if (u_use_diffuse_map > 0) 
   		diffuse_color *= texture(u_diffuse_map, v_uv).xyz;
    g_albedo = vec4(diffuse_color, specular);
}